import {Get, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {DeleteResult, Like, MoreThan, Repository} from "typeorm";

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity) // Inyectar Dependencias
        private _repositorioUsuario: Repository<UsuarioEntity>
    ) {
    }

    encontrarUno(id: number): Promise<UsuarioEntity | undefined> {
        return this._repositorioUsuario
            .findOne(id);
    }

    crearUno(usuario: UsuarioEntity) {
        return this._repositorioUsuario
            .save(usuario);
    }

    borrarUno(id: number): Promise<DeleteResult> {
        return this._repositorioUsuario
            .delete(id);
    }

    actualizarUno(
        id: number,
        usuario: UsuarioEntity
    ): Promise<UsuarioEntity> {
        usuario.id = id;
        return this._repositorioUsuario
            .save(usuario); // UPSERT
    }

    buscar(
        where: any = {},
        skip: number = 0,
        take: number = 10,
        order: any = {
            id: 'DESC',
            nombre: 'ASC'
        }
    ): Promise<UsuarioEntity[]> {

        // Exactamente el nombre o Exactamente la cedula
        const consultaWhere = [
            {
                nombre: ''
            },
            {
                cedula: ''
            }
        ];

        // Exactamente el nombre o LIKE la cedula
        const consultaWhereLike = [
            {
                nombre: Like('a%')
            },
            {
                cedula: Like('%a')
            }
        ];

        // id sea mayor a 20
        const consultaWhereMoreThan = {
            id: MoreThan(20)
        };

        // id sea igual a x
        const consultaWhereIgual = {
            id: 30
        };

        return this._repositorioUsuario
            .find({
                where: where,
                skip: skip,
                take: take,
                order: order,
            });
    }



}