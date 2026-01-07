import {
    Trophy,
    Target,
    Volleyball,
    Activity,
    Gamepad2,
    Dumbbell
} from "lucide-react"

export const SPORT_ICONS: Record<string, any> = {
    'Football': Activity, // Using Activity as generic sport or find better Football icon if available in Lucide (usually Dribbble or similar, but Activity is safe)
    'Futsal': Target,
    'Basketball': LoaderPinwheel, // Lucide doesn't have Basketball specific? Let's check imports.
    'Volleyball': Volleyball,
    'Badminton': Dumbbell, // Placeholder
    'Tennis': Activity,
    'Other': Trophy
}

// Map sport values to Lucide icon names or components
// Since we can't easily pass Components through server-client boundary if we serializing? 
// No, AppSidebar is client. We can import there. 
// Actually, let's just export the configuration here and import icons in the component to avoid import issues.
// For now, let's just define the list of valid sports here.
export const SPORTS = [
    'Football',
    'Futsal',
    'Basketball',
    'Volleyball',
    'Badminton',
    'Tennis',
    'Other'
] as const
