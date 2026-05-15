# Calculadora CDB

Solução completa para cálculo de rendimento de investimentos em CDB, composta por uma **Web API em .NET 8** e uma aplicação frontend em **Angular 17** (utilizando NgModel).

Agora, a aplicação está totalmente conteinerizada, facilitando a execução em qualquer ambiente através do Docker.

---

## 🛠️ Pré-requisitos

Para rodar este projeto, você precisa ter instalado apenas:

| Ferramenta | Versão Recomendada |
|-----------|-------------------|
| Docker | 20.10+ |
| Docker Compose | v2.0+ |

---

## 🚀 Como Executar o Projeto

Com o Docker instalado, você não precisa configurar o .NET ou o Node.js na sua máquina física.

### 1. Clonar o repositório

```bash
git clone <url-do-seu-repositorio>
cd <nome-da-pasta-do-repositorio>

---

## 2. Subir os Containers

Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
docker-compose up -d --build
```

Este comando irá:

- Construir a imagem da Web API (**CalculadoraCdb.Api**)
- Construir a imagem do Frontend (**cdb-frontend**)
- Orquestrar a comunicação entre eles

---

## 3. Acessar as Aplicações

Após a conclusão do build, as aplicações estarão disponíveis nos seguintes endereços:

- **Frontend (Angular):** http://localhost:4200
- **Web API (.NET):** http://localhost:5000
- **Documentação Swagger:** http://localhost:5000/swagger

---

# 🏗️ Arquitetura e Decisões Técnicas

## Web API (.NET 8)

### Containerização

- Uso de **Multi-stage build** para garantir imagens leves e seguras
- Execução como usuário **non-root**

### Clean Architecture

Separação clara entre:

- Controllers
- Services
- Interfaces

### Princípios SOLID

#### SRP (Single Responsibility Principle)

`CdbCalculatorService` lida com o cálculo, enquanto `TaxCalculatorService` gerencia as faixas de imposto.

#### OCP (Open/Closed Principle)

Novas regras de taxas podem ser adicionadas sem alterar o núcleo do cálculo.

#### DIP (Dependency Inversion Principle)

Uso intensivo de interfaces para desacoplamento.

### Segurança

- **Nullable Reference Types** habilitado para evitar erros de referência nula.

---

## Frontend (Angular 17)

### Conteinerização

- Servido via **Nginx** otimizado para produção dentro do Docker.

### Estrutura

- Uso de **NgModel** e **Reactive Forms** para validações declarativas.

### Comunicação

- `HttpClient` utilizando **Observables** para integração com a API.

### CORS

- Configurado para permitir comunicação fluida entre o container do front e o container da API.

---

# 📊 Análise de Qualidade

O projeto segue as diretrizes do **SonarLint**, garantindo código limpo e sustentável:

- ✅ Sem membros `public` desnecessários
- ✅ Ausência de Magic Numbers (uso de constantes)
- ✅ Sem variáveis ou dependências não utilizadas
- ✅ Tratamento correto de nulos

---

# 🛑 Como parar a aplicação

Para encerrar os serviços e remover os containers criados:

```bash
docker-compose down
```
