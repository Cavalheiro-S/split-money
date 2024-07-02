type ApiBase<T> = {
    data?: T,
    error?: string,
    message?: string,
    statusCode?: number,
    codeError?: string
}

type Pagination = {
    count: number,
    page: number
}