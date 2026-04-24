import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import FlashcardForm from './FlashcardForm'

describe('FlashcardForm Component', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Create Mode', () => {
    test('renders create mode form with correct heading', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByText('➕ Add New Flashcard')).toBeInTheDocument()
    })

    test('renders all form fields', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByLabelText('Foreign Word *')).toBeInTheDocument()
      expect(screen.getByLabelText('English Translation *')).toBeInTheDocument()
      expect(screen.getByLabelText('Language')).toBeInTheDocument()
      expect(screen.getByLabelText('Difficulty')).toBeInTheDocument()
      expect(screen.getByLabelText('Example Sentence')).toBeInTheDocument()
    })

    test('renders Add Flashcard button in create mode', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: 'Add Flashcard' })).toBeInTheDocument()
    })

    test('does not render Cancel button in create mode', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    })

    test('sets default values in create mode', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Intermediate')).toBeInTheDocument()
    })

    test('updates form fields on user input', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')

      await user.type(foreignWordInput, 'gato')
      await user.type(englishTranslationInput, 'cat')

      expect(foreignWordInput).toHaveValue('gato')
      expect(englishTranslationInput).toHaveValue('cat')
    })

    test('submits form with correct data', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const difficultySelect = screen.getByDisplayValue('Intermediate')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, 'gato')
      await user.type(englishTranslationInput, 'cat')
      await user.selectOptions(difficultySelect, 'ADVANCED')
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          foreignWord: 'gato',
          englishTranslation: 'cat',
          language: 'Spanish',
          difficulty: 3,
        })
      )
    })

    test('converts difficulty text to integer on submit', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const difficultySelect = screen.getByDisplayValue('Intermediate')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, 'test')
      await user.type(englishTranslationInput, 'test')
      await user.selectOptions(difficultySelect, 'BEGINNER')
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ difficulty: 1 })
      )
    })

    test('resets form after successful submission', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, 'gato')
      await user.type(englishTranslationInput, 'cat')
      await user.click(submitButton)

      expect(foreignWordInput).toHaveValue('')
      expect(englishTranslationInput).toHaveValue('')
    })

    test('allows changing language', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const languageSelect = screen.getByDisplayValue('Spanish')
      await user.selectOptions(languageSelect, 'French')

      expect(screen.getByDisplayValue('French')).toBeInTheDocument()
    })

    test('submits with all difficulty options', async () => {
      const user = userEvent.setup()
      const difficulties = [
        { display: 'Beginner', value: 1 },
        { display: 'Intermediate', value: 2 },
        { display: 'Advanced', value: 3 },
      ]

      for (const { display, value } of difficulties) {
        mockOnSubmit.mockClear()

        const { unmount } = render(
          <FlashcardForm
            onSubmit={mockOnSubmit}
            isEditing={false}
            onCancel={mockOnCancel}
          />
        )

        const foreignWordInput = screen.getByLabelText('Foreign Word *')
        const englishTranslationInput = screen.getByLabelText('English Translation *')
        const difficultySelect = screen.getByDisplayValue('Intermediate')
        const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

        await user.type(foreignWordInput, 'test')
        await user.type(englishTranslationInput, 'test')
        await user.selectOptions(difficultySelect, display)
        await user.click(submitButton)

        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ difficulty: value })
        )

        unmount()
      }
    })

    test('includes example sentence in submission when provided', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const exampleSentenceInput = screen.getByLabelText('Example Sentence')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, 'gato')
      await user.type(englishTranslationInput, 'cat')
      await user.type(exampleSentenceInput, 'El gato es negro.')
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ exampleSentence: 'El gato es negro.' })
      )
    })
  })

  describe('Edit Mode', () => {
    test('renders edit mode form with correct heading', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByText('✏️ Edit Flashcard')).toBeInTheDocument()
    })

    test('renders Update Flashcard button in edit mode', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: 'Update Flashcard' })).toBeInTheDocument()
    })

    test('renders Cancel button in edit mode', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('populates form with initial data', () => {
      const initialData = {
        foreignWord: 'gato',
        englishTranslation: 'cat',
        language: 'Spanish',
        difficulty: 2,
        exampleSentence: 'El gato es negro.',
      }

      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          initialData={initialData}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByDisplayValue('gato')).toBeInTheDocument()
      expect(screen.getByDisplayValue('cat')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Intermediate')).toBeInTheDocument()
      expect(screen.getByDisplayValue('El gato es negro.')).toBeInTheDocument()
    })

    test('converts numeric difficulty to text label on load', () => {
      const initialData = {
        foreignWord: 'test',
        englishTranslation: 'test',
        language: 'French',
        difficulty: 3,
      }

      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          initialData={initialData}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByDisplayValue('Advanced')).toBeInTheDocument()
    })

    test('calls onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    test('does not reset form after submitting in edit mode', async () => {
      const user = userEvent.setup()
      const initialData = {
        foreignWord: 'gato',
        englishTranslation: 'cat',
        language: 'Spanish',
        difficulty: 2,
      }

      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          initialData={initialData}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const submitButton = screen.getByRole('button', { name: 'Update Flashcard' })

      await user.clear(foreignWordInput)
      await user.type(foreignWordInput, 'perro')
      await user.click(submitButton)

      expect(screen.getByDisplayValue('perro')).toBeInTheDocument()
    })

    test('submits updated data correctly', async () => {
      const user = userEvent.setup()
      const initialData = {
        foreignWord: 'gato',
        englishTranslation: 'cat',
        language: 'Spanish',
        difficulty: 2,
      }

      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          initialData={initialData}
          isEditing={true}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const submitButton = screen.getByRole('button', { name: 'Update Flashcard' })

      await user.clear(foreignWordInput)
      await user.type(foreignWordInput, 'perro')
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          foreignWord: 'perro',
          englishTranslation: 'cat',
        })
      )
    })
  })

  describe('Form Validation', () => {
    test('prevents submission with empty foreign word', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(englishTranslationInput, 'cat')
      await user.click(submitButton)

      // Alert should be called
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })

    test('prevents submission with empty english translation', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, 'gato')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })

    test('prevents submission with whitespace-only fields', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, '   ')
      await user.type(englishTranslationInput, '   ')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })

    test('allows submission with only required fields filled', async () => {
      const user = userEvent.setup()
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const foreignWordInput = screen.getByLabelText('Foreign Word *')
      const englishTranslationInput = screen.getByLabelText('English Translation *')
      const submitButton = screen.getByRole('button', { name: 'Add Flashcard' })

      await user.type(foreignWordInput, 'gato')
      await user.type(englishTranslationInput, 'cat')
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  describe('Language Options', () => {
    test('renders all available languages', () => {
      render(
        <FlashcardForm
          onSubmit={mockOnSubmit}
          isEditing={false}
          onCancel={mockOnCancel}
        />
      )

      const languages = [
        'Spanish',
        'French',
        'German',
        'Italian',
        'Portuguese',
        'Japanese',
        'Chinese',
        'Korean',
      ]

      languages.forEach(lang => {
        expect(screen.getByRole('option', { name: lang })).toBeInTheDocument()
      })
    })
  })
})
