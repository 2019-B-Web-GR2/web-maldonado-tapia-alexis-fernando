import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario/usuario.entity";
import {UsuarioModule} from "./usuario/usuario.module"
import {UsuarioService} from "./usuario/usuario.service";
import {MascotaEntity} from "./mascotas/mascotas.entity";
import {MascotasModule} from "./mascotas/mascotas.module";

@Module({
  imports: [
    UsuarioModule,
    MascotasModule,
      TypeOrmModule.forRoot(
          {
                
                name: 'default',
                type: 'mysql',
                  host: '127.0.0.1',
                  port: 32769,
                  username: 'root',
                  password: 'root',
                  database: 'web',
                  dropSchema: false,
                  entities: [
                      UsuarioEntity,
                      MascotaEntity
                  ],
                  synchronize: true, // Crear -> true , Conectar -> false
          }
      )
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {
    constructor(
        private _usuarioService: UsuarioService
    ) {
        const usuarioPromesa = this._usuarioService.encontrarUno(1);
        console.log('Inicia');
        usuarioPromesa
            .then(
                (data)=>{
                    console.log('data', data);
                }
            )
            .catch(
                (error)=>{
                    console.log('error', error);
                }
            );
        console.log('Termina');
    }
}
