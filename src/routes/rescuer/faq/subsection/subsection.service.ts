import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FaqSubsection } from '../../../../database/faq-subsection.schema';

@Injectable()
export class SubsectionService {
  constructor(
    @InjectModel(FaqSubsection.name)
    private helpSubsectionModel: Model<FaqSubsection>,
  ) {}

  async subsectionId(id: string) {
    const result = await this.helpSubsectionModel.findById(id);
    if (result === null) {
      throw new HttpException('Aucune sous-section trouvé', 404);
    }
    return result;
  }
}
