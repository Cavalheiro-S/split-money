type Tag = {
    id: string;
    description: string;
    created_at: string;
    updated_at: string;
}

type RequestCreateTag = {
    description: string;
}

type RequestUpdateTag = {
    id: string;
    description: string;
}
