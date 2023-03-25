const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount == readPage ? true : false
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const noName = (name == undefined)
  const readTooBig = (readPage > pageCount)

  if (noName) {
    const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }

  if (readTooBig) {
    const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    })
    response.code(400)
    return response
  }
  
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }
  books.push(newBook)

  const isSuccess = books.filter((book) => book.id == id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
/*   const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku'
  })
  response.code(500)
  return response */
}


const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query  
  var bookArr = books
  
  const filterName = (name == undefined ? false : true)
  const filterReading = (reading == undefined ? false : true)
  const filterFinished = (finished == undefined ? false : true)

  if(filterName){
    bookArr = bookArr.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()))
  }
  if(filterReading){
    bookArr = bookArr.filter((n) => n.reading == reading)
  }
  if(filterFinished){
    bookArr = bookArr.filter((n) => n.finished == finished)
  }

  bookArr = bookArr.map(function(data) {
    return {
      "id" : data.id,
      "name" : data.name,
      "publisher" : data.publisher
    }
  });

  const response = h.response({
    status: 'success',
    data: {
        books : bookArr
    }
  }) 
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((n) => n.id == id)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
          book
      }
      })
      response.code(200)
      return response
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan"
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const noName = (name == undefined)
  const readTooBig = (readPage > pageCount)

  if (noName) {
    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }

  if (readTooBig) {
    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    })
    response.code(400)
    return response
  }

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((Book) => Book.id == id)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading,
      updatedAt
    }
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui"
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan"
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((Book) => Book.id == id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus"
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan"
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
