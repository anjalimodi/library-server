export class authorsModel{
    email:string;
    firstname:string;
    lastname:string;
}

export class booksModel{
    title:string;
    isbn:string;
    author:string;
    description:string;
}

export class magazinesModel{
    title:string;
    isbn:string;
    author:string;
    publishedAt:string;
}


export class isbnResponse{
    bookOrMagazine:string;
    title:string
    author:string;
}

export class emailResponse{
    title:string;
}