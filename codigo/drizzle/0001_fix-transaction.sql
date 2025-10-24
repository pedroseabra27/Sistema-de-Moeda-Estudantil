BEGIN;

ALTER TABLE "transacao" DROP COLUMN IF EXISTS "user_id";

ALTER TABLE "transacao" ADD COLUMN IF NOT EXISTS "professor_id" integer;
ALTER TABLE "transacao" ADD COLUMN IF NOT EXISTS "aluno_id" integer;

ALTER TABLE "transacao" ADD CONSTRAINT "transacao_professor_id_professor_id_fk"
    FOREIGN KEY ("professor_id") REFERENCES "public"."professor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "transacao" ADD CONSTRAINT "transacao_aluno_id_alunoT_id_fk"
    FOREIGN KEY ("aluno_id") REFERENCES "public"."alunoT"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT;