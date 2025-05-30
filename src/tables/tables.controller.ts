// src/tables/tables.controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // Adicione Param, UseGuards, NotFoundException, InternalServerErrorException
import * as fs from 'fs';
import * as path from 'path';
import * as csvParse from 'csv-parse/sync';
import { AuthGuard } from '@nestjs/passport'; // Importe AuthGuard

// Adicione o decorador @UseGuards se quiser proteger as rotas de tabela
@UseGuards(AuthGuard('jwt'))
@Controller('tabelas')
export class TabelasController {
  private readonly uploadDir = path.join(__dirname, '../../uploads'); // Definindo a pasta de uploads

  constructor() {
    // Garante que o diretório de uploads existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // NOVO ENDPOINT: Lista todos os nomes de arquivos CSV disponíveis
  @Get('files') // Rota: /tabelas/files
  getAvailableFiles() {
    try {
      const files = fs
        .readdirSync(this.uploadDir)
        .filter((f) => f.endsWith('.csv'));
      return files; // Retorna um array de strings com os nomes dos arquivos
    } catch (error) {
      console.error('Erro ao listar arquivos CSV:', error);
      throw new InternalServerErrorException(
        'Erro ao buscar a lista de arquivos.',
      );
    }
  }

  // MODIFICADO: Busca os dados de um arquivo CSV específico
  @Get(':fileName') // Rota: /tabelas/nomeDoArquivo.csv
  getSpecificTable(@Param('fileName') fileName: string) {
    const filePath = path.join(this.uploadDir, fileName);

    // Verifica se o arquivo existe e é um CSV
    if (!fs.existsSync(filePath) || !fileName.endsWith('.csv')) {
      throw new NotFoundException(
        `Arquivo '${fileName}' não encontrado ou não é um CSV.`,
      );
    }

    try {
      const conteudo = fs.readFileSync(filePath, 'utf-8');

      // Ajuste o parser para o delimitador ponto e vírgula
      const dados = csvParse.parse(conteudo, {
        delimiter: ';', // Define o ponto e vírgula como delimitador
        skip_empty_lines: true,
      });

      return {
        nomeArquivo: fileName,
        dados, // 'dados' já virá como um array de arrays (linhas e colunas)
      };
    } catch (error) {
      console.error(`Erro ao processar arquivo ${fileName}:`, error);
      throw new InternalServerErrorException(
        `Erro ao ler ou parsear o arquivo '${fileName}'.`,
      );
    }
  }

  // Remova o método getTabelas() antigo que listava todas as tabelas, pois ele foi substituído.
  // Seu código anterior era:
  // @Get()
  // getTabelas() {
  //   // ... lógica antiga
  // }
  // Não o inclua mais para evitar conflitos de rota e duplicidade de funcionalidade.
}
