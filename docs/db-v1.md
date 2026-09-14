


```
BusinessProfile {
  id
  userId                 unique

  businessName
  email                 
  phone?
  address?               
  taxId?                 

  logoUrl?
  defaultCurrency        
  invoicePrefix          
  nextInvoiceNumber   
  

  createdAt
  updatedAt
}
```

---

## client

```
Client {
  id
  userId

  name
  email?
  phone?
  address?
  notes?

  createdAt
  updatedAt
  deletedAt?             
}
```



---

## invoice


```
Invoice {
  id
  userId
  clientId

  number                 
  status                 // draft | sent | paid | cancelled

  issueDate
  dueDate
  paidAt?

  currency               
  notes?

  subtotal               
  taxRate?              
  taxAmount  
  discountPercentage?  
  discountAmount         
  totalAmount            

  createdAt
  updatedAt
  deletedAt?
}
```


---

## line_item

```
LineItem {
  id
  invoiceId

  description            
  quantity               
  unitPrice              
  amount                 

  sortOrder              

  createdAt
  updatedAt
}
```


---

## v1 relations

```
User 1 ── 1 BusinessProfile
User 1 ── * Client
User 1 ── * Invoice
Client 1 ── * Invoice
Invoice 1 ── * LineItem
```

---
