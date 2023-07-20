import {HttpException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../database/rescuer.schema';
import {Model, Types} from 'mongoose';
import {Request} from "express";

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async setStatus(userId: string, status: string): Promise<void> {
    const user: Rescuer = await this.rescuerModel.findById(
      new Types.ObjectId(userId),
    );
    if (!user) {
      throw new HttpException('Utilisateur introuvable', 404);
    }
    if (status == 'AVAILABLE') {
    } else if (status == 'NOT_AVAILABLE') {
    } else {
      throw new HttpException("Le type de status n'existe pas", 400);
    }
  }

  async getStatus(userId: string): Promise<{ status: string }> {
    const user: Rescuer = await this.rescuerModel.findById(
      new Types.ObjectId(userId),
    );
    if (!user) {
      throw new HttpException('Utilisateur introuvable', 404);
    }
    if (user.available)
      return {
        status: 'AVAILABLE',
      };
    else
      return {
        status: 'NOT_AVAILABLE',
      };
  }
}
