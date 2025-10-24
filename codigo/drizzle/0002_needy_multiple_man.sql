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
	"professor_cpf" text,
	"aluno_cpf" text
);
--> statement-breakpoint
ALTER TABLE "professor" ALTER COLUMN "saldo" SET DEFAULT 1000;--> statement-breakpoint
ALTER TABLE "professor" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "vantagem" ADD CONSTRAINT "vantagem_empresa_id_empresa_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_professor_cpf_professor_cpf_fk" FOREIGN KEY ("professor_cpf") REFERENCES "public"."professor"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_aluno_cpf_alunoT_cpf_fk" FOREIGN KEY ("aluno_cpf") REFERENCES "public"."alunoT"("cpf") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professor" ADD CONSTRAINT "professor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;