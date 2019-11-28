import {
  Body,
  Controller,
  createParamDecorator,
  Get,
  Header,
  Headers,
  HttpCode,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('bienvenida')
  public bienvenida(@Query() parametrosDeConsulta: ObjetoBienvenido,
                    @Query('nombre')nombre: string,
                    ): string {
    // tslint:disable-next-line:no-console
    console.log(parametrosDeConsulta);
    console.log(typeof parametrosDeConsulta.numero);
    return `Mensaje ${parametrosDeConsulta}`;
  }

  @Get('inscripcion-curso/:idCurso/:cedula')
  public inscripcionCurso(@Param() parametrosDeRuta: ObjetoInscripcion,

  ): string {
    // tslint:disable-next-line:no-console
    console.log(`Te inscribiste al curso:  ${parametrosDeRuta.idCurso}`);
    console.log(`Tu cedula es:  ${parametrosDeRuta.cedula}`);
    return `Te inscribiste al curso:  ${parametrosDeRuta.idCurso} <br> ${parametrosDeRuta.cedula}`;
  }

  @Post('almorzar')
  @HttpCode(200)
  public almorzar(
      @Body() parametrosDeCuerpo,
      @Body('id') id: number,
  ): string {
    console.log(parametrosDeCuerpo)
    return `${parametrosDeCuerpo}`;
  }

  @Get('obtener-cabeceras')
  obtenerCabeceras(
      @Headers() cabeceras,
  ) {
    console.log(cabeceras);
    return `Las cabeceras son: ${cabeceras}`;
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
