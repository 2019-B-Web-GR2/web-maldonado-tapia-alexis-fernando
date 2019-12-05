// @ts-ignore
import {
  Body,
  Controller,
  createParamDecorator, Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sumar')
  @HttpCode(200)
  sumar(
      @Headers() cabeceras,
  ) {
    // tslint:disable-next-line:no-console
    console.log(cabeceras);
    let suma = parseInt(cabeceras.num1) + parseInt(cabeceras.num2);
    return `La suma es: ${suma}`;
  }

  @Post('restar')
  @HttpCode(201)
  public restar(
      @Body() parametrosDeCuerpo,
      @Body('num1') num1: number,
      @Body('num2') num2: number,
  ): string {
    let resta = num1 - num2;
    return `La resta es: ${resta}`;
  }

  @Put('multiplicar')
  @HttpCode(202)
  public multiplicar(@Query() parametrosDeConsulta,
                     @Query('num1') num1: number,
                     @Query('num2') num2: number,
  ): string {
    let multiplicacion = num1 * num2;
    return `La multiplicacion es ${multiplicacion}`;
  }

  @Delete('dividir')
  @HttpCode(203)
  public dividir(@Query() numerosQuery,
                 @Body('num1') num1: number,
                 @Body('num2') num2: number,
                 @Headers() cabeceras,
  ): string {
    let divisionHeaders = parseInt(cabeceras.num1)/parseInt(cabeceras.num2);
    let divisionBody = (num1)/(num2);
    let divisionQuery = parseInt(numerosQuery.num1)/parseInt(numerosQuery.num2);
    return `La division Headers es ${divisionHeaders} \n La division Body es ${divisionBody} \n La division Query es ${divisionQuery}`;
  }




}


interface ObjetoBienvenido {
  nombre?: string;
  numero?: string;
  casado?: string;
}

interface ObjetoInscripcion {
  idCurso: string;
  cedula: string;
}
