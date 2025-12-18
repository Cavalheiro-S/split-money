type Category = {
    id: string;
    description: string;
    created_at: string;
    updated_at: string;
}

type RequestCreateCategory = {
    description: string;
}

type RequestUpdateCategory = {
    id: string;
    description: string;
}
