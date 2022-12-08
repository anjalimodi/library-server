import { Body, Controller, Post } from '@nestjs/common';
import { addBookDataInput, addMagazineDataInput, emailInput, isbnInput, readFileInput } from './library.dto';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
    constructor(
        private libraryService:LibraryService
    ){}

    @Post('readFiles')
    async libraryProcessor(@Body() input:readFileInput){
        let response
         await this.libraryService.readFiles(input)
        .then((res)=>{
            response=res
        })
        .catch((err)=>{
            console.log("libraryProcessor error---",err)
        })
        return response
    }

    @Post('isbn')
    async searchByIsbn(@Body() input:isbnInput){
       return await this.libraryService.searchFileInformationByIsbn(input)
    }

    @Post('email')
    async searchByEmail(@Body() input:emailInput){
        return await this.libraryService.searchFileInformationByEmail(input)
    }

    @Post('addBook')
    async addBookDataHandler(@Body() input:addBookDataInput){
        return await this.libraryService.addBookData(input)
    }

    @Post('addMagazine')
    async addMagazineData(@Body() input:addMagazineDataInput){
        return await this.libraryService.addMagazinesData(input)
    }
}
