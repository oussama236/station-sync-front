import { Component } from '@angular/core';

@Component({
  selector: 'app-lubrifiant',
  templateUrl: './lubrifiant.component.html',
  styleUrls: ['./lubrifiant.component.scss']
})
export class LubrifiantComponent {
  listOfData: any[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
}
