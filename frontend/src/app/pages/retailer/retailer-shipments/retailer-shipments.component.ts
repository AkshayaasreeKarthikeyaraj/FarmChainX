import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-retailer-shipments',
  templateUrl: './retailer-shipments.component.html',
})
export class RetailerShipmentsComponent implements OnInit {
  shipments: any[] = [];
  loading = true;
  verifyingId: any = null;
  verificationChecked = false;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.fetchShipments();
  }

  fetchShipments() {
    this.loading = true;
    this.productService.getPendingShipments().subscribe({
      next: (data) => {
        // Backend returns Page object
        this.shipments = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load shipments', err);
        this.loading = false;
      }
    });
  }





  startVerification(id: any) {
    this.verifyingId = id;
    this.verificationChecked = false;
  }

  cancelVerification() {
    this.verifyingId = null;
    this.verificationChecked = false;
  }

  confirmReceipt(shipment: any) {
    if (!this.verificationChecked) {
      return;
    }

    const location = "Retailer Store (Received)";
    this.productService.confirmReceipt(shipment.productId, location).subscribe({
      next: () => {
        alert('✅ Receipt Confirmed! Product is now in your Inventory.');
        this.fetchShipments();
        this.verifyingId = null;
      },
      error: (err) => {
        alert('Error confirming receipt: ' + err.error?.error || err.message);
      }
    });
  }
}
