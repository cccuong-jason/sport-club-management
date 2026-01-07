'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    CircleDashed,
} from 'lucide-react'
import { FaFutbol, FaBasketballBall, FaVolleyballBall } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";
import { MdSportsTennis } from "react-icons/md";

// Mapping for icons 
// Using best-match icons available in lucide-react standard set
const SportIcons: Record<string, React.ElementType> = {
    Football: FaFutbol,
    Futsal: FaFutbol,
    Basketball: FaBasketballBall,
    Volleyball: FaVolleyballBall,
    Badminton: GiShuttlecock,
    Tennis: MdSportsTennis,
    Other: CircleDashed
}

type TeamSetupFormProps = {
    createTeam: (formData: FormData) => Promise<void>
}

export function TeamSetupForm({ createTeam }: TeamSetupFormProps) {
    const [lang, setLang] = useState<'vi' | 'en'>('vi')

    const t = {
        vi: {
            title: 'Thiết Lập Đội',
            description: 'Cấu hình thông tin cơ bản cho đội của bạn.',
            name: 'Tên Đội',
            namePlaceholder: 'VD: CLB Bóng Đá Hà Nội',
            sport: 'Môn Thể Thao',
            sportPlaceholder: 'Chọn môn thể thao',
            currency: 'Tiền Tệ',
            language: 'Ngôn Ngữ',
            submit: 'Tạo Đội',
            sports: {
                Football: 'Bóng đá',
                Futsal: 'Bóng đá trong nhà (Futsal)',
                Basketball: 'Bóng rổ',
                Volleyball: 'Bóng chuyền',
                Badminton: 'Cầu lông',
                Tennis: 'Quần vợt',
                Other: 'Khác'
            }
        },
        en: {
            title: 'Team Setup',
            description: 'Configure basic information for your team.',
            name: 'Team Name',
            namePlaceholder: 'e.g. Hanoi Football Club',
            sport: 'Sport',
            sportPlaceholder: 'Select a sport',
            currency: 'Currency',
            language: 'Language',
            submit: 'Create Team',
            sports: {
                Football: 'Football',
                Futsal: 'Futsal',
                Basketball: 'Basketball',
                Volleyball: 'Volleyball',
                Badminton: 'Badminton',
                Tennis: 'Tennis',
                Other: 'Other'
            }
        }
    }

    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.append('language', lang)
        await createTeam(formData)
        setLoading(false)
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{t[lang].title}</CardTitle>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLang('vi')}
                            type="button"
                            className={`text-xs px-2 py-1 rounded transition-colors ${lang === 'vi' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                        >
                            VI
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            type="button"
                            className={`text-xs px-2 py-1 rounded transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                        >
                            EN
                        </button>
                    </div>
                </div>
                <CardDescription>
                    {t[lang].description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t[lang].name}</Label>
                        <Input id="name" name="name" placeholder={t[lang].namePlaceholder} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sport">{t[lang].sport}</Label>
                        <Select name="sport" required>
                            <SelectTrigger>
                                <SelectValue placeholder={t[lang].sportPlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(t[lang].sports).map(([key, label]) => {
                                    const Icon = SportIcons[key] || CircleDashed
                                    return (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                <span>{label}</span>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">{t[lang].currency}</Label>
                        <Select name="currency" defaultValue="VND" required>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VND">VND (Vietnam Dong)</SelectItem>
                                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                <SelectItem value="EUR">EUR (Euro)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? '...' : t[lang].submit}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
