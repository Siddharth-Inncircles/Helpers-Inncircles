import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import HelperModel, {IHelper} from "./src/models/helper.model"
 
mongoose.connect('mongodb://localhost:27017/test');

(async () => {
  const helpers : Partial<IHelper>[] = [];

  for (let i = 1; i <= 500; i++) {
    helpers.push({
      employeeCode: `${String(i).padStart(5, '0')}`,
      name: faker.person.fullName(),
      type: faker.helpers.arrayElement(["Nurse", "Driver", "Newspaper", "Laundry", "Maid", "Plumber", "Cook"]),
      organization: faker.helpers.arrayElement(["ASBL", "Springs", "Springs Helpers"]),
      gender: faker.helpers.arrayElement(['Male', 'Female']),
      language: [faker.word.noun(), faker.word.noun()],
      mobileNo: faker.phone.number(),
      emailId: faker.internet.email(),
      joinedOn: faker.date.past(),
      households: faker.number.int({ min: 0, max: 5 }),
      vechileType: faker.helpers.arrayElement(["Other", "Bike", "Car", "Cycle", "Bus", "None"]),
      vechileNumber: faker.vehicle.vin(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await HelperModel.insertMany(helpers);
  console.log('500 helpers inserted');
  process.exit();
})();
