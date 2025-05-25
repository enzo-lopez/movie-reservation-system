'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Movie {
  _id: string
  title: string
  genre: string[]
  duration: string
  poster: string
  description: string
}

const genres = [
  'Action',
  'Adventure',
  'Crime',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Thriller',
  'Sci-Fi',
]

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [formData, setFormData] = useState<Partial<Movie>>({})


  const columns = [
    {key: 'title' as const, label: 'Title'},
    {key: 'genre' as const, label: 'Genre'},
    {key: 'duration' as const, label: 'Duration'},
    {key: 'poster' as const, label: 'Poster'},
  ]

  // Fetch movies on page load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie`)
        if (!response.ok) {
          throw new Error('Error fetching movies')
        }
        const data = await response.json()
        setMovies(data)
      } catch (err) {
        console.error(err)
        alert('Error fetching movies')
      }
    }

    fetchMovies()
  }, [])

  const handleAdd = async (movie: Partial<Movie>) => {
    try {
      console.log('Adding movie:', movie)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(movie),
      })

      if (!response.ok) {
        throw new Error('Error adding movie')
      }

      const newMovie = await response.json()
      setMovies([...movies, newMovie])
    } catch (err) {
      console.error(err)
      alert('Error adding movie' )
    }
  }

  const handleEdit = async (id: string, updatedMovie: Partial<Movie>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedMovie),
      })

      if (!response.ok) {
        throw new Error('Error editing movie')
      }

      const updatedMovieData = await response.json()
      setMovies(
        movies.map(movie => (movie._id === id ? updatedMovieData : movie))
      )
    } catch (err) {
      console.error(err)
      alert('Error editing movie')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error deleting movie')
      }

      setMovies(movies.filter(movie => movie._id !== id))
    } catch (err) {
      console.error(err)
      alert('Error deleting movie')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMovie) {
      handleEdit(editingMovie._id, formData)
    } else {
      handleAdd(formData)
    }
    setFormData({})
    setEditingMovie(null)
    setIsDialogOpen(false)
  }

  const toggleGenre = (genre: string) => {
    const currentGenres = formData.genre || []
    if (currentGenres.includes(genre)) {
      setFormData({...formData, genre: currentGenres.filter(g => g !== genre)})
    } else {
      setFormData({...formData, genre: [...currentGenres, genre]})
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Movies</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingMovie(null)
                setFormData({})
              }}
            >
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMovie ? 'Edit' : 'Add'} Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={e =>
                    setFormData({...formData, title: e.target.value})
                  }
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Genres</label>
                <div className='flex flex-wrap gap-2'>
                  {genres.map(genre => (
                    <Button
                      key={genre}
                      variant={
                        formData.genre?.includes(genre) ? 'default' : 'outline'
                      }
                      onClick={() => toggleGenre(genre)}
                      type='button'
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Duration
                </label>
                <Input
                  value={formData.duration || ''}
                  onChange={e =>
                    setFormData({...formData, duration: e.target.value})
                  }
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Poster URL
                </label>
                <Input
                  value={formData.poster || ''}
                  onChange={e =>
                    setFormData({...formData, poster: e.target.value})
                  }
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Description
                </label>
                <Textarea
                  value={formData.description || ''}
                  onChange={e =>
                    setFormData({...formData, description: e.target.value})
                  }
                  required
                />
              </div>
              <Button type='submit'>{editingMovie ? 'Update' : 'Add'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className='border rounded-lg'>
        <table className='w-full'>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key} className='p-2 text-left'>
                  {column.label}
                </th>
              ))}
              <th className='p-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td className='p-2'>{movie.title}</td>
                <td className='p-2'>{movie.genre.join(', ')}</td>
                <td className='p-2'>{movie.duration}</td>
                <td className='p-2'>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className='w-16 h-auto'
                  />
                </td>
                <td className='p-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditingMovie(movie)
                      setFormData(movie)
                      setIsDialogOpen(true)
                    }}
                    className='mr-2'
                  >
                    Edit
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(movie._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
