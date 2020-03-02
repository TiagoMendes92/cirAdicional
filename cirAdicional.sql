USE [master]
GO
/****** Object:  Database [cirurgia_adicional]    Script Date: 02/03/2020 14:06:18 ******/
CREATE DATABASE [cirurgia_adicional]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'cirurgia_adicional', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\cirurgia_adicional.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'cirurgia_adicional_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\cirurgia_adicional_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [cirurgia_adicional] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [cirurgia_adicional].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [cirurgia_adicional] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET ARITHABORT OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [cirurgia_adicional] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [cirurgia_adicional] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET  DISABLE_BROKER 
GO
ALTER DATABASE [cirurgia_adicional] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [cirurgia_adicional] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET RECOVERY FULL 
GO
ALTER DATABASE [cirurgia_adicional] SET  MULTI_USER 
GO
ALTER DATABASE [cirurgia_adicional] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [cirurgia_adicional] SET DB_CHAINING OFF 
GO
ALTER DATABASE [cirurgia_adicional] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [cirurgia_adicional] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [cirurgia_adicional] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'cirurgia_adicional', N'ON'
GO
ALTER DATABASE [cirurgia_adicional] SET QUERY_STORE = OFF
GO
USE [cirurgia_adicional]
GO
/****** Object:  Table [dbo].[data_adicional_bloco]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_bloco](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_diagnosticos]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_diagnosticos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sigla] [varchar](255) NOT NULL,
	[nome] [varchar](755) NOT NULL,
	[cod_diagnostico] [varchar](20) NOT NULL,
	[cod_portaria] [varchar](255) NOT NULL,
 CONSTRAINT [PK__data_adi__3213E83F7A39F0C2] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_episodio]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_episodio](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[num_processo] [varchar](111) NOT NULL,
	[nome] [varchar](755) NOT NULL,
	[dta_cirurgia] [date] NOT NULL,
	[cir_segura] [smallint] NOT NULL,
	[gdh1] [int] NULL,
	[gdh2] [int] NULL,
	[n_episode_cir] [int] NULL,
	[dta_episodio] [datetime2](0) NULL,
	[servico] [int] NOT NULL,
	[n_episode_int] [int] NOT NULL,
	[dta_admissao] [datetime2](0) NULL,
	[dta_alta] [datetime2](0) NULL,
	[tipo_anestesia] [varchar](255) NOT NULL,
	[bloco] [int] NOT NULL,
	[sala] [varchar](555) NOT NULL,
	[tipo_cirurgia] [varchar](555) NOT NULL,
	[horas_oper_ini] [time](0) NOT NULL,
	[horas_oper_fim] [time](0) NOT NULL,
	[hora_anest] [varchar](555) NOT NULL,
	[hora_cir] [varchar](555) NOT NULL,
	[sdd] [varchar](255) NULL,
	[rdm] [varchar](255) NULL,
	[dta_recobro] [datetime2](0) NOT NULL,
	[destino] [varchar](255) NOT NULL,
	[ato_cir] [varchar](255) NOT NULL,
	[estado] [int] NOT NULL,
	[data_estado] [date] NULL,
	[pago] [int] NOT NULL,
	[included_in_file] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_episodio_diagnosticos]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_episodio_diagnosticos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_episodio] [int] NOT NULL,
	[id_diagnostico] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_episodio_intervencoes]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_episodio_intervencoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_episodio] [int] NOT NULL,
	[id_intervencoes] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_equipas]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_equipas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nmec] [varchar](55) NOT NULL,
	[id_episodio] [int] NOT NULL,
	[id_funcao_sonho] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_funcao]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_funcao](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sigla] [varchar](15) NOT NULL,
	[funcao] [varchar](555) NOT NULL,
	[perc] [decimal](10, 2) NOT NULL,
	[equipa] [varchar](5) NOT NULL,
	[id_servico] [varchar](25) NOT NULL,
 CONSTRAINT [PK__data_adi__3213E83FEC65180B] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_gdh]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_gdh](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[desc] [varchar](555) NOT NULL,
	[gdh] [varchar](255) NOT NULL,
	[perc] [decimal](38, 2) NOT NULL,
	[v_uni] [decimal](38, 2) NOT NULL,
	[cod_gdh] [varchar](20) NOT NULL,
	[cod_portaria] [varchar](255) NOT NULL,
 CONSTRAINT [PK__data_adi__3213E83F1AC34B5C] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_historic]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_historic](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date] [datetime2](0) NOT NULL,
	[tipo] [varchar](255) NOT NULL,
	[info] [varchar](max) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_intervencoes]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_intervencoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sigla] [varchar](255) NOT NULL,
	[nome] [varchar](775) NOT NULL,
	[cod_intervencao] [varchar](20) NOT NULL,
	[cod_portaria] [varchar](255) NOT NULL,
 CONSTRAINT [PK__data_adi__3213E83F6CB51C0D] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_intervenientes]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_intervenientes](
	[id_episodio] [int] NOT NULL,
	[id_prof] [int] NOT NULL,
	[id_funcao] [varchar](max) NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_prof]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_prof](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[n_mec] [varchar](55) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_servico]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_servico](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[servico] [varchar](555) NOT NULL,
	[agrupamento] [varchar](555) NOT NULL,
	[dupla_validacao_equipa] [smallint] NOT NULL,
	[horario_ini] [time](7) NOT NULL,
	[horario_fim] [time](7) NOT NULL,
	[listaGHDs] [text] NULL,
 CONSTRAINT [PK__data_adi__3213E83F4EBF793F] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_adicional_sonho_funcoes]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_adicional_sonho_funcoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [varchar](55) NOT NULL,
	[descricao] [nchar](555) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_portaria]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_portaria](
	[cod_portaria] [varchar](255) NOT NULL,
	[data_inicio] [date] NOT NULL,
	[data_fim] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[login]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[login](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user] [varchar](255) NOT NULL,
	[pass] [varchar](255) NOT NULL,
	[role_id] [int] NOT NULL,
	[servico_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 02/03/2020 14:06:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[role] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [episodio_gdh2_id_gdh]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [episodio_gdh2_id_gdh] ON [dbo].[data_adicional_episodio]
(
	[gdh2] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [episodio_gh1_id_gdh]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [episodio_gh1_id_gdh] ON [dbo].[data_adicional_episodio]
(
	[gdh1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [episodio_id_bloco]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [episodio_id_bloco] ON [dbo].[data_adicional_episodio]
(
	[bloco] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [episodio_id_servie]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [episodio_id_servie] ON [dbo].[data_adicional_episodio]
(
	[servico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [id_diagnostico_episodio]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [id_diagnostico_episodio] ON [dbo].[data_adicional_episodio_diagnosticos]
(
	[id_diagnostico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [id_episodio_diagnostico]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [id_episodio_diagnostico] ON [dbo].[data_adicional_episodio_diagnosticos]
(
	[id_episodio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [id_episodio_intervencao]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [id_episodio_intervencao] ON [dbo].[data_adicional_episodio_intervencoes]
(
	[id_episodio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [id_intervencao_episodio]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [id_intervencao_episodio] ON [dbo].[data_adicional_episodio_intervencoes]
(
	[id_intervencoes] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [user_id_servico]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [user_id_servico] ON [dbo].[login]
(
	[servico_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [user_role]    Script Date: 02/03/2020 14:06:19 ******/
CREATE NONCLUSTERED INDEX [user_role] ON [dbo].[login]
(
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [gdh1]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [gdh2]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [n_episode_cir]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [dta_episodio]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [dta_admissao]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [dta_alta]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [sdd]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [rdm]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT ('0') FOR [estado]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT (NULL) FOR [data_estado]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT ('0') FOR [pago]
GO
ALTER TABLE [dbo].[data_adicional_episodio] ADD  DEFAULT ('0') FOR [included_in_file]
GO
ALTER TABLE [dbo].[login] ADD  DEFAULT (NULL) FOR [servico_id]
GO
USE [master]
GO
ALTER DATABASE [cirurgia_adicional] SET  READ_WRITE 
GO
