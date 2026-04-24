import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import FlashcardCard from './FlashcardCard'

describe('FlashcardCard Component', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const defaultCard = {
    id: 1,
    foreignWord: 'gato',
    englishTranslation: 'cat',
    language: 'Spanish',
    difficulty: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders flashcard with foreign word on front', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.getByText('Foreign Word')).toBeInTheDocument()
    expect(screen.getByText('gato')).toBeInTheDocument()
  })

  test('renders English translation on back', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.getByText('English Translation')).toBeInTheDocument()
    expect(screen.getByText('cat')).toBeInTheDocument()
  })

  test('renders language badge', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.getByText('Spanish')).toBeInTheDocument()
  })

  test('renders difficulty badge with BEGINNER label for difficulty 1', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.getByText('BEGINNER')).toBeInTheDocument()
  })

  test('renders difficulty badge with INTERMEDIATE label for difficulty 2', () => {
    const card = { ...defaultCard, difficulty: 2 }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument()
  })

  test('renders difficulty badge with ADVANCED label for difficulty 3', () => {
    const card = { ...defaultCard, difficulty: 3 }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('ADVANCED')).toBeInTheDocument()
  })

  test('renders difficulty badge with string labels', () => {
    const card = { ...defaultCard, difficulty: 'CUSTOM' }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('CUSTOM')).toBeInTheDocument()
  })

  test('renders difficulty badge with UNKNOWN for invalid numeric difficulty', () => {
    const card = { ...defaultCard, difficulty: 99 }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })

  test('renders example sentence when provided', () => {
    const card = { ...defaultCard, exampleSentence: 'El gato es negro.' }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('Example:')).toBeInTheDocument()
    expect(screen.getByText('El gato es negro.')).toBeInTheDocument()
  })

  test('does not render example sentence when not provided', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.queryByText('Example:')).not.toBeInTheDocument()
  })

  test('renders Edit button with correct click handler', async () => {
    const user = userEvent.setup()
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const editButton = screen.getByRole('button', { name: /Edit/ })
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(1)
  })

  test('renders Delete button with correct click handler', async () => {
    const user = userEvent.setup()
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const deleteButton = screen.getByRole('button', { name: /Delete/ })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  test('flips card when clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const cardInner = container.querySelector('.card-inner')
    expect(cardInner).not.toHaveClass('flipped')

    await user.click(cardInner)

    expect(cardInner).toHaveClass('flipped')
  })

  test('toggles flipped state on multiple clicks', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const cardInner = container.querySelector('.card-inner')

    // First click - flip to show back
    await user.click(cardInner)
    expect(cardInner).toHaveClass('flipped')

    // Second click - flip back to front
    await user.click(cardInner)
    expect(cardInner).not.toHaveClass('flipped')

    // Third click - flip to show back again
    await user.click(cardInner)
    expect(cardInner).toHaveClass('flipped')
  })

  test('resets flip state when forceFlipped prop changes', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(
      <FlashcardCard
        card={defaultCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        forceFlipped={false}
      />
    )

    const cardInner = container.querySelector('.card-inner')

    // Flip the card manually
    await user.click(cardInner)
    expect(cardInner).toHaveClass('flipped')

    // Change forceFlipped prop - should reset flip state
    rerender(
      <FlashcardCard
        card={defaultCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        forceFlipped={true}
      />
    )

    // Card should still appear flipped due to XOR logic (forceFlipped=true XOR isFlipped=false = true)
    expect(cardInner).toHaveClass('flipped')
  })

  test('applies XOR logic for forceFlipped prop and local state', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(
      <FlashcardCard
        card={defaultCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        forceFlipped={false}
      />
    )

    const cardInner = container.querySelector('.card-inner')

    // Initial state: forceFlipped=false, isFlipped=false -> not flipped
    expect(cardInner).not.toHaveClass('flipped')

    // Set forceFlipped=true: forceFlipped=true XOR isFlipped=false -> flipped
    rerender(
      <FlashcardCard
        card={defaultCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        forceFlipped={true}
      />
    )
    expect(cardInner).toHaveClass('flipped')

    // Click to flip locally: forceFlipped=true XOR isFlipped=true -> not flipped
    await user.click(cardInner)
    expect(cardInner).not.toHaveClass('flipped')

    // Click again: forceFlipped=true XOR isFlipped=false -> flipped
    await user.click(cardInner)
    expect(cardInner).toHaveClass('flipped')
  })

  test('renders flip hints', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.getByText('Click to reveal')).toBeInTheDocument()
    expect(screen.getByText('Click to go back')).toBeInTheDocument()
  })

  test('handles cards with different languages', () => {
    const frenchCard = { ...defaultCard, language: 'French', foreignWord: 'chat' }
    render(<FlashcardCard card={frenchCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('French')).toBeInTheDocument()
  })

  test('sets correct background color for BEGINNER difficulty badge', () => {
    const { container } = render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const difficultyBadge = container.querySelector('.badge-difficulty')
    expect(difficultyBadge).toHaveStyle({ backgroundColor: '#4CAF50' })
  })

  test('sets correct background color for INTERMEDIATE difficulty badge', () => {
    const card = { ...defaultCard, difficulty: 2 }
    const { container } = render(
      <FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const difficultyBadge = container.querySelector('.badge-difficulty')
    expect(difficultyBadge).toHaveStyle({ backgroundColor: '#FF9800' })
  })

  test('sets correct background color for ADVANCED difficulty badge', () => {
    const card = { ...defaultCard, difficulty: 3 }
    const { container } = render(
      <FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    const difficultyBadge = container.querySelector('.badge-difficulty')
    expect(difficultyBadge).toHaveStyle({ backgroundColor: '#f44336' })
  })

  test('displays both Edit and Delete buttons', () => {
    render(
      <FlashcardCard card={defaultCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    )

    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()
  })

  test('calls onEdit with correct card ID', async () => {
    const user = userEvent.setup()
    const card = { ...defaultCard, id: 42 }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const editButton = screen.getByRole('button', { name: /Edit/ })
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(42)
  })

  test('calls onDelete with correct card ID', async () => {
    const user = userEvent.setup()
    const card = { ...defaultCard, id: 42 }
    render(<FlashcardCard card={card} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /Delete/ })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(42)
  })
})
