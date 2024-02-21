require('dotenv').config()

module.exports = {
    getPagingData: (data, page, limit) => {
        const { count: totalItems, rows: result } = data;
        const currentPage = page ? +page : 1;
        const totalPages = Math.ceil(totalItems / limit);

        return { totalItems, result, totalPages, currentPage };
    },
    getPagination: (page, size) => {
        const limit = size ? +size : 10;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    },
}