import { ApiProperty } from "@nestjs/swagger";

export class readFileInput{
    @ApiProperty()
    fileName:string;
}

export class isbnInput{
    @ApiProperty()
    isbnNo:string;
}

export class emailInput{
    @ApiProperty()
    email:string;
}

export class addBookDataInput{
    csvData:string;
}

export class addMagazineDataInput{
   csvData:string;
}
