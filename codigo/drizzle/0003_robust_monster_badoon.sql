CREATE TABLE "vantagem_resgatada" (
	"id" serial PRIMARY KEY NOT NULL,
	"vantagem_id" integer NOT NULL,
	"aluno_id" integer NOT NULL,
	"transacao_id" text NOT NULL,
	"resgatada_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vantagem_resgatada" ADD CONSTRAINT "vantagem_resgatada_vantagem_id_vantagem_id_fk" FOREIGN KEY ("vantagem_id") REFERENCES "public"."vantagem"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vantagem_resgatada" ADD CONSTRAINT "vantagem_resgatada_aluno_id_alunoT_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunoT"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vantagem_resgatada" ADD CONSTRAINT "vantagem_resgatada_transacao_id_transacao_id_fk" FOREIGN KEY ("transacao_id") REFERENCES "public"."transacao"("id") ON DELETE no action ON UPDATE no action;