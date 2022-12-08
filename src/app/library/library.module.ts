import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
    imports:[],
    providers:[LibraryService],
    exports:[],
    controllers:[LibraryController]
})
export class LibraryModule {}
