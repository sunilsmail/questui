import { Injectable } from '@angular/core';
import { GroupedSlots, PscFullDaySlots, PscTimeSlot, SlotAvailableType } from 'shared/models';
import { groupBy, repeat, timeDiff } from 'shared/utils/util';

@Injectable({
  providedIn: 'root'
})
export class PscSlotService {

  getFormattedMorningTimeSlots(timeSlots: PscFullDaySlots): PscTimeSlot[] {
    let formattedTimeSlots: PscTimeSlot[] = [];
    if (timeSlots && timeSlots.pscMorningTime && timeSlots.pscMorningTime.length > 0) {
      formattedTimeSlots = timeSlots.pscMorningTime.map((ele) => {
        if (ele.available === true) {
          ele.available = SlotAvailableType.available;
        }
        else if (ele.available === false) {
          ele.available = SlotAvailableType.unAvailable;
        }
        return ele;
      });
      // formattedTimeSlots = this.roundStartingSlots(formattedTimeSlots);
      if (formattedTimeSlots.length > 1) {
        formattedTimeSlots = this.roundTimeslots(formattedTimeSlots);
      }

      // formattedTimeSlots = this.calculateSlots(formattedTimeSlots);
    }
    return formattedTimeSlots;
  }

  getFormattedAfternoonTimeSlots(timeSlots: PscFullDaySlots): PscTimeSlot[] {
    let formattedTimeSlots: PscTimeSlot[] = [];
    if (timeSlots && timeSlots.pscAfternoonTime && timeSlots.pscAfternoonTime.length > 0) {
      formattedTimeSlots = timeSlots.pscAfternoonTime.map((ele) => {
        if (ele.available === true) {
          ele.available = SlotAvailableType.available;
        }
        else if (ele.available === false) {
          ele.available = SlotAvailableType.unAvailable;
        }
        return ele;
      });
      // formattedTimeSlots = this.roundStartingSlots(formattedTimeSlots);
      // formattedTimeSlots = this.roundEndingSlots(formattedTimeSlots);
      if (formattedTimeSlots.length > 1) {
        formattedTimeSlots = this.roundTimeslots(formattedTimeSlots);
      }
      // formattedTimeSlots = this.calculateSlots(formattedTimeSlots);

    }
    return formattedTimeSlots;
  }

  // roundStartingSlots2(slots: PscTimeSlot[]): PscTimeSlot[] {
  //   let endTime: string;
  //   const slotsToAdd: PscTimeSlot[] = [];
  //   if (slots && slots.length > 0) {
  //     const startHour = slots[0].time.split(':')[0];
  //     const startMins = +slots[0].time.split(':')[1];
  //     const range = this.getTimeDifference(slots);
  //     if(startMins % 2 === 0){
  //       endTime = `${startHour}:00`;
  //     }else{

  //     }
  //     let itemIndex = 0;

  //     while (itemIndex >= 0) {
  //       if (endTime === slots[0].time) {
  //         break;
  //       }
  //       console.log('roundStartingSlots - ', itemIndex, slots.length);
  //       if (endTime !== slots[0].time) {
  //         const missingSlot: PscTimeSlot = {
  //           available: SlotAvailableType.noSlot,
  //           time: endTime
  //         };
  //         slotsToAdd.push(missingSlot);
  //         const interval = range * (itemIndex + 1);
  //         endTime = `${startHour}:${interval}`;
  //         itemIndex++;
  //       }
  //     }

  //     // for (let index = 0; index <= slots.length - 1; index++) {
  //     //   console.log('roundStartingSlots - ', index, slots.length);
  //     //   if (endTime === slots[0].time) {
  //     //     break;
  //     //   }
  //     //   if (endTime !== slots[0].time) {
  //     //     const missingSlot: PscTimeSlot = {
  //     //       available: SlotAvailableType.noSlot,
  //     //       time: endTime
  //     //     };
  //     //     slotsToAdd.unshift(missingSlot);
  //     //     const interval = range * (index + 1);
  //     //     endTime = `${startHour}:${interval}`;
  //     //   }
  //     // }


  //   }
  //   return slotsToAdd.concat(slots);
  // }

  // roundEndingSlots2(slots: PscTimeSlot[]): PscTimeSlot[] {
  //   let endTime: string;
  //   const slotsToAdd: PscTimeSlot[] = [];
  //   if (slots && slots.length > 0) {
  //     const lastSlot = slots.length - 1;
  //     const endHour = slots[lastSlot].time.split(':')[0];
  //     const range = this.getTimeDifference(slots);
  //     let endMins = this.getEndMins(range);
  //     endTime = `${endHour}:${endMins}`;
  //     let itemIndex = 0;
  //     while (itemIndex >= 0) {
  //       console.log('roundEndingSlots - ', itemIndex, slots.length);
  //       if (endTime === slots[lastSlot].time) {
  //         break;
  //       }
  //       if (endTime !== slots[lastSlot].time) {
  //         const missingSlot: PscTimeSlot = {
  //           available: SlotAvailableType.noSlot,
  //           time: endTime
  //         };
  //         slotsToAdd.unshift(missingSlot);
  //         endMins = +endMins - range;
  //         endTime = `${endHour}:${endMins}`;
  //         itemIndex++;
  //       }
  //     }

  //     // for (let index = 0; index <= slots.length - 1; index++) {
  //     //   console.log('roundEndingSlots - ', index, slots.length);
  //     //   if (endTime === slots[lastSlot].time) {
  //     //     break;
  //     //   }
  //     //   if (endTime !== slots[lastSlot].time) {
  //     //     const missingSlot: PscTimeSlot = {
  //     //       available: SlotAvailableType.noSlot,
  //     //       time: endTime
  //     //     };
  //     //     slotsToAdd.unshift(missingSlot);
  //     //     endMins = +endMins - range;
  //     //     endTime = `${endHour}:${endMins}`;
  //     //   }
  //     // }


  //   }
  //   return slots.concat(slotsToAdd);
  // }

  getTimeDifference(slots: PscTimeSlot[]): number {
    const firstSlot = 0;
    const secondSlot = 1;
    if (slots.length > 1) {
      const t1 = slots[firstSlot].time;
      const t2 = slots[secondSlot].time;
      return timeDiff(t1, t2);
    }
    return 0;
    // let diff = +t2[1] - +t1[1];
    // if(Math.abs(diff) > 15){
    //   t1 = slots[firstSlot + 1].time.split(':');
    //   t2 = slots[secondSlot + 1].time.split(':');
    //    diff = +t2[1] - +t1[1];
    // }
    // return Math.abs(diff);
  }

  // getEndMins(range: number): number {
  //   let endMins: string;
  //   if (range === 15) {
  //     endMins = `${range * 3}`;
  //   } else if (range === 10) {
  //     endMins = `${range * 5}`;
  //   } else if (range === 5) {
  //     endMins = `${range * 11}`;
  //   }
  //   return +endMins;
  // }

  addHoursPropertyToSlots(data: any[]): any[] {
    const newData = data.map((val) => {
      const time = val.time.split(':')[0];
      return {
        ...val,
        hour: time
      };
    });
    return newData;
  }

  roundTimeslots(slots: PscTimeSlot[]): PscTimeSlot[] {
    const missingSlot: PscTimeSlot = {
      available: SlotAvailableType.noSlot,
      time: ''
    };
    const range = this.getTimeDifference(slots);
    const totalSlotsPerHour = 60 / range;
    // let count = 0;
    if (slots && slots.length > 0) {
      if (slots.length > 1) {
        const startTime: any = +slots[0].time.split(':')[0];
        const endTime: any = +slots[slots.length - 1].time.split(':')[0];
        const diff = (endTime + 1) - startTime;
        const totalSlots = diff * (60 / range);
        if (totalSlots === slots.length) {
          return slots;
        }
      }
      const addedHourProperty = this.addHoursPropertyToSlots(slots);
      const groupedData: GroupedSlots = groupBy(addedHourProperty, 'hour');
      const items = Object.keys(groupedData).sort();
      const slotsPerHour = (60 / range);
      // for start position
      const firstIndex = 0;
      if (items.length === 1) {
        if (groupedData[items[firstIndex]].length !== slotsPerHour) {
          const datatoEnterStart: PscTimeSlot[] = repeat(missingSlot,totalSlotsPerHour - groupedData[items[firstIndex]].length);
          if(groupedData[items[firstIndex]][0].time.split(':')[1] === '00'  ){
            groupedData[items[firstIndex]] = [...groupedData[items[firstIndex]], ...datatoEnterStart];
          }else{
            groupedData[items[firstIndex]] = [...datatoEnterStart, ...groupedData[items[firstIndex]]];
          }

        }
      } else {
        if (groupedData[items[firstIndex]].length !== slotsPerHour && groupedData[items[firstIndex]][0].time.split(':')[1] !== '00') {
          const datatoEnterStart: any[] = repeat(missingSlot, totalSlotsPerHour - groupedData[items[firstIndex]].length);
          groupedData[items[firstIndex]] = [...datatoEnterStart, ...groupedData[items[firstIndex]]];
        }
      }


      // for end position
      if (items.length > 1) {
        const lastIndex = items.length - 1;
        if (groupedData[items[lastIndex]].length !== slotsPerHour) {
          const datatoEnterEnd: any[] = repeat(missingSlot, totalSlotsPerHour - groupedData[items[lastIndex]].length);
          groupedData[items[lastIndex]] = [...groupedData[items[lastIndex]], ...datatoEnterEnd];
        }
      }

      // for (let i = 0; i < items.length - 1; i++) {
      //   if (groupedData[items[i]].length !== totalSlotsPerHour) {
      //     if (count === 0) {
      //       const datatoEnter: any[] = repeat(missingSlot, totalSlotsPerHour - groupedData[items[i]].length);
      //       groupedData[items[i]] = [...datatoEnter, ...groupedData[items[i]]];
      //     } else {
      //       const datatoEnter = repeat(missingSlot, totalSlotsPerHour - groupedData[items[i]].length);
      //       // groupedData[items[i]] = [...groupedData[items[i]], ...datatoEnter];
      //       groupedData[items[i]] = [...datatoEnter, ...groupedData[items[i]]];

      //     }
      //     count++;
      //   }
      // }
      let slotstoreturn = [];
      const items1 = Object.keys(groupedData).sort();
      for (let i = 0; i <= items1.length - 1; i++) {
        slotstoreturn = [...slotstoreturn, ...groupedData[items1[i]]];
      }
      slotstoreturn.forEach((data) => delete data.hour);
      return slotstoreturn;
    }
    return [];
  }

  // roundTimeslotsV2(slots: PscTimeSlot[]): PscTimeSlot[] {
  //   try {
  //     if (slots.length === 0) {
  //       return slots;
  //     }
  //     const interval = this.getTimeDifference(slots);
  //     let startTime: any = +slots[0].time.split(':')[0];
  //     const endTime: any = +slots[slots.length - 1].time.split(':')[0];
  //     const timeSlots: PscTimeSlot[] = [];
  //     if (startTime && endTime) {
  //       const diff = (endTime + 1) - startTime;
  //       const totalSlots = diff * (60 / interval);
  //       if (totalSlots === slots.length) {
  //         return slots;
  //       }
  //       const slotsPerHour = (60 / interval);
  //       let count = 0;
  //       const addedHourProperty = this.addHoursPropertyToSlots(slots);
  //       const groupedData = groupBy(addedHourProperty, 'hour');
  //       let firstSlot = null;
  //       for (const property in groupedData) {
  //         if(groupedData[property].lenth === slotsPerHour ){
  //           firstSlot = groupedData[property][0].time;
  //         }
  //       }
  //       const slotsPerHourArray = Array.from({ length: slotsPerHour }, (v, k) => (k * interval));
  //       for (let i = 1; i <= totalSlots; i++) {
  //         if (count < slotsPerHour) {
  //           const hour = slotsPerHourArray[count].toString().length === 1 ?
  //             slotsPerHourArray[count].toString().padStart(2, '0') : slotsPerHourArray[count];
  //           startTime = startTime.toString().length === 1 ? startTime.toString().padStart(2, '0') : startTime;
  //           timeSlots.push({
  //             time: `${startTime}:${hour}`,
  //             available: SlotAvailableType.noSlot
  //           });
  //           count++;
  //           if (count === slotsPerHour) {
  //             startTime = +startTime + 1;
  //             count = 0;
  //           }
  //         }
  //       }
  //     }
  //     for (let i = 0; i <= slots.length - 1; i++) {
  //       const index = timeSlots.findIndex(item => item.time === slots[i].time);
  //       if (index > -1) {
  //         timeSlots.splice(index, 1, slots[i]);
  //       }
  //     }
  //     return timeSlots;
  //   }
  //   catch (ex) {
  //     return slots;
  //   }
  // }
}
