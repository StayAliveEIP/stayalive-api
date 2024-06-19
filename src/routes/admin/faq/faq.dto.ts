import { IsNotEmpty, IsString } from 'class-validator';

export class SectionPostDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'title' est obligatoire." })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'description' est obligatoire." })
  readonly description: string;
}

export class HelpIdDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'id' est obligatoire." })
  readonly id: string;
}

export class SectionDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'id' est obligatoire." })
  readonly _id: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'title' est obligatoire." })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'description' est obligatoire." })
  readonly description: string;
}

export class SubsectionDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'section' est obligatoire." })
  readonly section: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'title' est obligatoire." })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'description' est obligatoire." })
  readonly description: string;
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'subsection' est obligatoire." })
  readonly subsection: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'question' est obligatoire." })
  readonly question: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'answer' est obligatoire." })
  readonly answer: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'author' est obligatoire." })
  readonly author: string;
}

export class QuestionPutDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'subsection' est obligatoire." })
  readonly subsection: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'question' est obligatoire." })
  readonly question: string;

  @IsString()
  @IsNotEmpty({ message: "Le champs : 'answer' est obligatoire." })
  readonly answer: string;
}

export class SearchDto {
  @IsString()
  @IsNotEmpty({ message: "Le champs : 'search' est obligatoire." })
  readonly search: string;
}
