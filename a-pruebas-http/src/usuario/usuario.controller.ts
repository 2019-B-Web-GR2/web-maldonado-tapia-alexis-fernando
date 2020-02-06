import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req, Res,
    Session
} from "@nestjs/common";
import {UsuarioService} from "./usuario.service";
import {UsuarioEntity} from "./usuario.entity";
import {DeleteResult, Like} from "typeorm";
import * as Joi from '@hapi/joi';
import {UsuarioCreateDto} from "./usuario.create-dto";
import {validate} from "class-validator";
import {UsuarioUpdateDto} from "./usuario.update-dto";
import {options} from "tsconfig-paths/lib/options";

@Controller('usuario')
export class UsuarioController {
    constructor(
        private readonly _usuarioService: UsuarioService,
    ) {
    }


    @Get('ruta/mostrar-usuarios')
    async rutaMostrarUsuarios(
        @Query('mensaje') mensaje: string,
        @Query('error') error: string,
        @Query('consultarUsuario') consultarUsuario: string,
        @Res() res,
    ){
        let consultaServicio;
        if(consultarUsuario){
            consultaServicio = [
                {
                    nombre: Like('%'+consultarUsuario+'%')
                },
                {
                    cedula: Like('%'+consultarUsuario+'%')
                }
            ];
        }
        const usuarios = await this._usuarioService.buscar(consultaServicio);
        res.render('usuario/rutas/buscar-mostrar-usuario',
            {
                datos: {
                    //usuarios: usuarios
                    usuarios,
                    mensaje,
                    error
                }
            }
        );
    }

    @Get('ruta/crear-usuario')
    rutaCrearUsuario(
        @Query('error') error: string,
        @Res() res,

    ){
        res.render('usuario/rutas/crear-usuario',
            {
                datos:{
                    error
                }
            }
        );
    }

    @Get('ruta/editar-usuario/:idUsuario')
    async rutaEditarUsuario(
        @Query('error') error: string,
        @Param('idUsuario') idUsuario: string,
        @Res() res,

    ){
        const consulta = {
                id: idUsuario
        }
        try{

            const arregloUsuarios = await this._usuarioService.buscar(consulta);
            if(arregloUsuarios.length > 0){
                res.render('usuario/rutas/crear-usuario',
                    {
                        datos:{
                            error,
                            usuario: arregloUsuarios[0]
                        }
                    }
                );
            }else{
                res.redirect(
                    '/usuario/ruta/mostrar-usuarios?error=No existe ese usuario'
                );
                res.status(400);
                res.send('ERROR CONECTAR USUARIO');
            }

        }catch (e) {
            res.redirect('/usuario/ruta/mostrar-usuarios?error=Error editando usuario')
        }

    }

    @Get('ejemploejs')
    ejemploejs(
        @Res() res
    ){
        res.render('ejemplo',{
            datos:{
                nombre: 'Alexis',
                suma: this.suma, // Definicion de la funcion
                joi: Joi
            }
        })
    }

    suma(numUno, numDos){
        return numUno + numDos;
    }

    @Post('login')
    login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Session() session
    ){
        console.log('Session',session)
        if(username === 'adrian' && password === '1234'){
            session.usuario = {
                nombre: 'Adrian',
                userId: 1,
                roles: ['Administrador']
            }
                return 'ok';
        }

        if(username === 'vicente' && password === '1234'){
            session.usuario = {
                nombre: 'Vicente',
                userId: 2,
                roles: ['Supervisor']
            }
            return 'ok';
        }

        throw new BadRequestException('No envia credenciales')
    }

    @Get('logout')
    logout(
        @Session() session,
        @Req() req,
    ){
        session.usuario = undefined;
        req.session.destroy();
        return session
    }

    @Get('sesion')
    sesion(
        @Session() session
    ){
        return session;
    }

    @Get('hola')
    hola(
        @Session() session
    ):string{
        let roles: string = '';

        if(session.usuario){
            roles+= '<ul>';
            session.usuario.roles.forEach(x=>{
                roles+= '<li>';
                roles+=x;
                roles+= '</li>';
               roles+='\n';
            });
            roles+= '</ul>';
        }
        return `
            <html>
                <head> <title>EPN</title> </head>
                <body>
                    <h1> Mi primera pagina web ${
                        session.usuario ? session.usuario.nombre : ''}
                    </h1>
                    ${roles}
                </body>

            </html>        
        `
    }

    @Get()
    async buscar(
        @Query('skip') skip?: string | number,
        @Query('take') take?: string | number,
        @Query('where') where?: string,
        @Query('order') order?: string
    ): Promise<UsuarioEntity[]>{

        const nuevoEsquema = Joi.object({
           skip: Joi.number()

        });

        try{
            const objetoValidado = await nuevoEsquema.validateAsync({
                skip: skip
            });
            console.log('objetoValidado', objetoValidado)
        }catch (e) {
            console.error('Error', e);
        }
        if(order){
            try {
                order = JSON.parse(order);
            }catch (e) {
                order = undefined;
            }
        }

        if(where){
            try {
                where = JSON.parse(where);
            }catch (e) {
                where = undefined;
            }
        }

        if(skip){
            skip = +skip;
        }

        if(take){
            take = +take;
        }

        return this._usuarioService.buscar(
            where,
            skip as number,
            take as number,
            order
        );
    }

    @Get(':id')
    obtenerUnUsuario(
        @Param('id') identificador: string,
    ):Promise<UsuarioEntity | undefined>{
        return this._usuarioService
            .encontrarUno(Number(identificador));
    }

    @Post()
    async ingresarUsuario(
        @Body() identificador: UsuarioEntity,
        @Session() session,
        @Res() res
    ):Promise<void>{
        if(session){
            if(session.usuario.roles.includes('Administrador')){
                const usuarioCreateDto = new UsuarioCreateDto();
                usuarioCreateDto.nombre = identificador.nombre;
                usuarioCreateDto.cedula = identificador.cedula;
                const errores = await validate(usuarioCreateDto);
                if(errores.length > 0){
                    res.redirect('/usuario/ruta/crear-usuario?error=Error validando');
                }else {
                    try {
                        await this._usuarioService.crearUno(identificador);
                        res.redirect('usuario/ruta/mostrar-usuarios?mensaje=Usuario Creado Correctamente');
                    }catch (e) {
                        res.redirect('/usuario/ruta/crear-usuario?error=Error validando');
                    }
                }
            }else{
                throw new BadRequestException('No es Administrador')
            }
        }

    }

    @Post(':id')
    async actualizarUnUsuario(
        @Body() usuario: UsuarioEntity,
        @Param('id') id: string,
        @Session() session,
        @Res() res,
    ): Promise<void>{
        //if(session.usuario.roles.includes('Administrador') || session.usuario.roles.includes('Supervisor')){
            const usuarioUpdateDto = new UsuarioUpdateDto();
            usuarioUpdateDto.nombre = usuario.nombre;
            usuarioUpdateDto.cedula = usuario.cedula;
            usuarioUpdateDto.id = +id;
            const errores = await validate(usuarioUpdateDto);
            if(errores.length > 0){
                res.redirect(
                    '/usuario/ruta/editar-usuario/'+id+'?error=Usuario no Validado',
                )
            }else {
                await this._usuarioService.actualizarUno(usuario.id, usuario);
                res.rendirect(
                    '/usuario/ruta/mostrar-usuarios?mensaje=El usuario '+usuario.nombre+' actualizado'
                )
            }
        /*}else{
            throw new BadRequestException('No es Administrador o Supervisor')
        }*/
    }

    @Delete(':id')
    eliminarUnUsuario(
        @Param('id') id: string,
        @Session() session
    ): Promise<DeleteResult>{
        if(session.usuario.roles.includes('Administrador')){
            return this._usuarioService.borrarUno(+id);
        }else {
            throw new BadRequestException('No es Administrador')
        }

    }

    @Post(':id')
    async eliminarUnoPost(
        @Param('id') id: string,
        @Session() session,
        @Res() res
    ): Promise<void>{
        if(session.usuario.roles.includes('Administrador')){
            try{
                await this._usuarioService.borrarUno(+id);
                res.redirect(`/usuario/ruta/mostrar-usuarios?mensaje=Usuario ID: ${id} eliminado`);

            }catch (error) {
                console.error(error);
                res.redirect('/usuario/ruta/mostrar-usuarios?error =Error del servidor');
            }
        }else {
            throw new BadRequestException('No es Administrador')
        }

    }


}