-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Answer_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "answer_id" INTEGER,
    "reply_id" INTEGER,

    CONSTRAINT "Like_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" SERIAL NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "parent_id" INTEGER,
    "date" DATE NOT NULL,

    CONSTRAINT "Reply_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Tag_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "user_id" INTEGER NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "answers_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Thread_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "creation_date" DATE NOT NULL,
    "facebook_id" VARCHAR(255),
    "instagram_id" VARCHAR(255),
    "github_id" VARCHAR(255),
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "thread_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(255) NOT NULL,

    CONSTRAINT "Vote_pk" PRIMARY KEY ("thread_id","user_id")
);

-- CreateTable
CREATE TABLE "saved_threads" (
    "thread_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "saved_threads_pk" PRIMARY KEY ("thread_id","user_id")
);

-- CreateTable
CREATE TABLE "threads_tags" (
    "thread_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "threads_tags_pk" PRIMARY KEY ("thread_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_fk0" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_fk1" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_fk1" FOREIGN KEY ("answer_id") REFERENCES "Answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_fk2" FOREIGN KEY ("reply_id") REFERENCES "Reply"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_fk0" FOREIGN KEY ("answer_id") REFERENCES "Answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_fk1" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_fk2" FOREIGN KEY ("parent_id") REFERENCES "Reply"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_fk0" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_fk1" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saved_threads" ADD CONSTRAINT "saved_threads_fk0" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saved_threads" ADD CONSTRAINT "saved_threads_fk1" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "threads_tags" ADD CONSTRAINT "threads_tags_fk0" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "threads_tags" ADD CONSTRAINT "threads_tags_fk1" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
