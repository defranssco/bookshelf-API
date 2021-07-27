const { nanoid } = require('nanoid');
const books = require('./books');

const addHandler = (request, h) => {
    
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading 
    } = request.payload;

    const id = nanoid(10);
    const finished = (readPage === pageCount);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
        
    } else if (readPage > pageCount) {
        const response = h.response({
            'status': 'fail',
            'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
        
    }
    
    
    const newBook = {
        id,
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
        
    } 

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
};

const getAllHandler = (request, h) => {
    const { 
        name, 
        reading, 
        finished
    } = request.query;

    var book = books;

    if (name !== undefined) {
        book = book.filter((bk) => bk.name.toUpperCase().includes(name.toUpperCase()));
    }else if (reading !== undefined) {
        book = book.filter((bk) => bk.reading === Boolean(Number(reading)));
    } else if (finished !== undefined) {
        book = book.filter((bk) => bk.finished === Boolean(Number(finished)));
    } 

    const response = h.response({
        status: 'success',
        data: {
            books: book.map((bk) => ({
                id: bk.id,
                name: bk.id,
                publisher: bk.publisher,
            })),
        },
    });
    response.code(200);
    return response;
}

const getByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((bk) => id === bk.id)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,  
            },
        });
        
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editByIdHandler = (request, h) => {
    const { id } = request.params;
    const updatedAt = new Date().toISOString();
    
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading  
    } = request.payload;
    
    const finished = (readPage === pageCount);
    const indexOfBook = books.findIndex((book) => book.id === id);
    
    if (indexOfBook !== -1) {
        
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
            
        } else if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        } 

        books[indexOfBook] = {
            ...books[indexOfBook],
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteHandler = (request, h) => {
    const { id } = request.params;
   
    const indexOfBook = books.findIndex((book) => id === book.id);
   
    if (indexOfBook !== -1) {
        books.splice(indexOfBook, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
   
   const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

module.exports = { 
    addHandler, 
    getAllHandler, 
    getByIdHandler, 
    editByIdHandler,
    deleteHandler,
};