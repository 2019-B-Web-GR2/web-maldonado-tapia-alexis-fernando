import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

//var nombre = "Alexis";
let apellido:string = 'Maldonado';
const cedula:string = '1725....';
apellido = 'Tapia';


class Usuario{
  public cedula: string = '1871233';
  cedula2 = '18171233';

  private holaMundo(){
    console.log('Hola');
  }
}
