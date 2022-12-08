import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { authorsModel, booksModel, emailResponse, isbnResponse, magazinesModel } from './library.model';

@Injectable()
export class LibraryService {

    async readFiles(input){
        try {
          let columnCSV,csvData
          switch(input.fileName){
            case 'authors.csv' : columnCSV=['email','firstname','lastname']
                                  csvData=new Array<authorsModel>()
                                  break;
            
            case 'books.csv' : columnCSV=['title','isbn','authors','description']
                                csvData=new Array<booksModel>()
                                break;
            
            case 'magazines.csv' : columnCSV=['title','isbn','authors','publishedAt']
                                  csvData=new Array<magazinesModel>()
                                  break;
          }
          
          return new Promise(function(resolve,reject){
            let rowNumber=2 // as data row start from 2
           fs.createReadStream(`src/assets/${input.fileName}`)
          .pipe(csv({headers:columnCSV,strict:true, skipLines:1
          }))
          .on('data',function(csvrow) {
              for(let i in csvrow){
                if(!csvrow[i].length){
                  reject("Data not found for row: "+rowNumber)
                } 
              }
              rowNumber++
              csvData.push(csvrow);  
               
          })
          .on('error',(error)=>{       
            reject(error)
          })
          .on('end',(err)=>{
           if(err)
           throw err
            else{   
            
            resolve(csvData)
           }
          });
        })
          } catch (error) {
            console.log("Read file error--",error)
          };
    }

    async searchFileInformationByIsbn(input){
      const bookFileName={
        fileName:"books.csv"
      }

      const magazinesFileName={
        fileName:"magazines.csv"
      }

      
      let bookFileResponse:any=await this.readFiles(bookFileName)
      let magazinesFileResponse:any = await this.readFiles(magazinesFileName)
      let mergedArray=bookFileResponse.concat(magazinesFileResponse)
      let searchResult=new isbnResponse()
      mergedArray.filter((obj)=>{
        if(obj.isbn == input.isbnNo){
          obj.publishedAt ? searchResult.bookOrMagazine = "magazine" : 
          obj.description ? searchResult.bookOrMagazine = "book" : searchResult.bookOrMagazine = ''
          searchResult.title = obj.title
          searchResult.author=obj.authors
        }
      })
      return searchResult
    }

    async searchFileInformationByEmail(input){
      const bookFileName={
        fileName:"books.csv"
      }

      const magazinesFileName={
        fileName:"magazines.csv"
      }

      let bookFileResponse:any=await this.readFiles(bookFileName)
      let magazinesFileResponse:any = await this.readFiles(magazinesFileName)
      let mergedArray=bookFileResponse.concat(magazinesFileResponse)
      let response=new Array<emailResponse>()

      mergedArray.forEach((obj)=>{
        if(obj.authors == input.email){
          let matchedObject=new emailResponse()
          matchedObject.title=obj.title
          response.push(matchedObject)
        }
      })

      response.sort((a,b)=> (a.title > b.title ? 1 : -1))
      return response
      
    }

    async addBookData(input){
      try{
        let fileContent="title,isbn,authors,description\n"
        fileContent+=input.csvData
        let writeBookStatus=await new Promise((resolve, reject) => {
          fs.writeFile("src/assets/exportBook.csv",fileContent,(err)=>{
            if(err){
              return reject(err)
            }
            resolve("Book csv file exported successfully")
            
          })
          })
          .then((res:string)=>{
          return res
        })
    
        return writeBookStatus
    
      }catch(error){
        console.log("Add Book data error",error)
      }
  }

  async addMagazinesData(input){
    try{
      let fileContent="title,isbn,authors,publishedAt\n"
      fileContent+=input.csvData
      let writeMagazineStatus=await new Promise((resolve, reject) => {
      fs.writeFile("src/assets/exportMagazine.csv",fileContent,(err)=>{
        if(err){
          return reject(err)
        }
        resolve("Magazine csv file exported successfully")
        
      })
      })
      .then((res:string)=>{
      return res
    })

    return writeMagazineStatus

    }catch(error){
      console.log("Add Magazine data error",error)
    }
  }
}
