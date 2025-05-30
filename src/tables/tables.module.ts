// src/tables/tables.module.ts
import { Module } from '@nestjs/common';
import { TabelasController } from './tables.controller';
import { PassportModule } from '@nestjs/passport'; // Importe PassportModule
import { JwtModule } from '@nestjs/jwt'; // Importe JwtModule se usar JwtStrategy

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Para usar AuthGuard('jwt')
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // Use a mesma chave secreta do AuthModule
      signOptions: { expiresIn: '7d' }, // Opcional, mas boa prática manter consistência
    }),
  ],
  controllers: [TabelasController],
  providers: [], // Não precisa de services aqui, pois toda lógica está no controller
  exports: [], // Não precisa exportar nada, a menos que outros módulos precisem usar algo do TablesModule
})
export class TabelasModule {}
