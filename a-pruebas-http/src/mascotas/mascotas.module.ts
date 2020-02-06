import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MascotaEntity} from "./mascotas.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
                MascotaEntity // entidades a usarse en el modulo
            ],
            'default' // cadena de conexion
        ),
    ],
})
export class MascotasModule{}