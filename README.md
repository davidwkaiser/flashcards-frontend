# Flashcards Frontend

A modern React frontend for the Flashcards API built with Vite and Axios.

## Features

- 📚 View all flashcards
- ➕ Create new flashcards
- ✏️ Edit existing flashcards
- 🗑️ Delete flashcards
- 🔍 Search flashcards by keyword
- 🎯 Filter by difficulty level
- 💾 Persistent data with backend API
- 🎨 Beautiful, responsive UI
- 🔄 Flip cards to see translations

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Flashcards API running on http://localhost:8080

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000 with API proxy configured.

### Building

Build for production:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── FlashcardForm.jsx       # Form to create/edit flashcards
│   ├── FlashcardList.jsx       # List container for flashcards
│   ├── FlashcardCard.jsx       # Individual flashcard with flip animation
│   └── SearchBar.jsx           # Search and filter controls
├── api.js                       # Axios API service
├── App.jsx                      # Main app component
├── App.css                      # App styling
└── main.jsx                     # Entry point
```

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api/flashcards`.

### Supported Endpoints

- `GET /api/flashcards` - Get all flashcards
- `GET /api/flashcards/{id}` - Get flashcard by ID
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/{id}` - Update flashcard
- `DELETE /api/flashcards/{id}` - Delete flashcard
- `DELETE /api/flashcards` - Delete all flashcards
- `GET /api/flashcards/language/{language}` - Get by language
- `GET /api/flashcards/difficulty/{difficulty}` - Get by difficulty
- `GET /api/flashcards/search?keyword={keyword}` - Search flashcards
- `GET /api/flashcards/stats/total` - Get total count

## Features Detail

### Flashcard Form
- Add new flashcards with foreign word, English translation, language, and difficulty
- Edit existing flashcards
- Optional example sentences
- Form validation

### Flashcard Cards
- Interactive flip animation to reveal translations
- Display language and difficulty badges
- Show example sentences if available
- Edit and delete buttons

### Search & Filter
- Real-time search by keyword
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- Clear search option

## Styling

The app uses CSS modules and custom CSS with:
- Gradient backgrounds
- Smooth animations and transitions
- Responsive grid layout
- Mobile-friendly design
- Beautiful color scheme

## Error Handling

- Connection errors to the API are displayed to the user
- Form validation to prevent empty submissions
- Confirmation dialogs before deleting flashcards

## Future Enhancements

- User authentication
- Flashcard decks/categories
- Spaced repetition algorithm
- Stats and progress tracking
- Dark mode
- Language selection UI
- Audio pronunciation
- Keyboard navigation

## License

MIT
