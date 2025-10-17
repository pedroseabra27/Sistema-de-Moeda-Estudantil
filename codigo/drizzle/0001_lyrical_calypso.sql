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
	"saldo" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresa" (
	"id" serial PRIMARY KEY NOT NULL,
	"cnpj" text NOT NULL,
	"user_id" text
);
--> statement-breakpoint
ALTER TABLE "alunoT" ADD CONSTRAINT "alunoT_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;