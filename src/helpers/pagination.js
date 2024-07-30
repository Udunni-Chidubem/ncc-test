require('dotenv').config()

module.exports = {
    getPagingData: (data, page, limit) => {
        const { count: totalItems, rows: result } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        let previousPage = currentPage - 1;
        let nextPage = currentPage + 1;
        if (currentPage == 0){
            previousPage = currentPage;
        } 
        if (nextPage == totalPages){
            nextPage = totalPages - 1;
        } 
        const next = currentPage + 1;
        return { totalItems, result, totalPages, currentPage, previousPage, nextPage };
    },
    getPagination: (page, size) => {
        const limit = size ? +size : 10;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    },
}