CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alunoT" (
	"id" serial PRIMARY KEY NOT NULL,
	"cpf" text NOT NULL,
	"endereco" text,
	"curso" text NOT NULL,
	"saldo" integer DEFAULT 0 NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "alunoT_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE "professor" (
	"cpf" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"departamento" text NOT NULL,
	"saldo" integer DEFAULT 1000 NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "empresa" (
	"id" serial PRIMARY KEY NOT NULL,
	"cnpj" text NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "vantagem" (
	"id" serial PRIMARY KEY NOT NULL,
	"descricao" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"empresa_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transacao" (
	"id" text PRIMARY KEY NOT NULL,
	"motivo" text NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL,
	"valor" integer DEFAULT 1000 NOT NULL,
	"professor_id" integer,
	"aluno_id" integer
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alunoT" ADD CONSTRAINT "alunoT_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professor" ADD CONSTRAINT "professor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vantagem" ADD CONSTRAINT "vantagem_empresa_id_empresa_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_professor_id_professor_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."professor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_aluno_id_alunoT_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunoT"("id") ON DELETE no action ON UPDATE no action;