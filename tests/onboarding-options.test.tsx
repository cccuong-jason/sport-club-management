import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingOptions } from '@/app/[locale]/onboarding/OnboardingOptions'

// Mock the action
jest.mock('@/app/[locale]/onboarding/actions', () => ({
    exploreCommunityAction: jest.fn()
}))

// Mock the nested components
jest.mock('@/app/[locale]/onboarding/CreateClubForm', () => ({
    CreateClubForm: () => <div data-testid="create-club-form">Create Club Form</div>
}))
jest.mock('@/app/[locale]/onboarding/SearchClubForm', () => ({
    SearchClubForm: () => <div data-testid="search-club-form">Search Club Form</div>
}))

describe('OnboardingOptions', () => {
    it('renders all three onboarding options', () => {
        render(<OnboardingOptions />)
        
        expect(screen.getByText('I am a Player')).toBeInTheDocument()
        expect(screen.getByText('I am a Manager')).toBeInTheDocument()
        expect(screen.getByText('Explore Community')).toBeInTheDocument()
    })

    it('navigates to player search flow on click', () => {
        render(<OnboardingOptions />)
        fireEvent.click(screen.getByText('Find My Club'))
        
        expect(screen.getByTestId('search-club-form')).toBeInTheDocument()
    })

    it('navigates to manager create flow on click', () => {
        render(<OnboardingOptions />)
        fireEvent.click(screen.getByText('Create Club Space'))
        
        expect(screen.getByTestId('create-club-form')).toBeInTheDocument()
    })
})
