import  React , { useState, useEffect } from 'react';
import './Invoicelist.css';
 
const InvoiceList = () => {


    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [filterCompany, setFilterCompany] = useState(""); // State to store the selected company for filtering
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl,setPdfUrl] = useState(null);
  
    useEffect(() => {
      fetch('http://localhost:5000/api/data')
        .then(response => response.json())
        .then(data => setInvoices(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };
  
    const handleUpdate = (InvoiceNumber) => {
      setSelectedInvoice(prevState => {
        if (prevState && prevState.InvoiceNumber === InvoiceNumber) {
          return null;
        } else {
          const invoiceToUpdate = invoices.find(invoice => invoice.InvoiceNumber === InvoiceNumber);
          if (invoiceToUpdate) {
            return { ...invoiceToUpdate };
          }
        }
      });
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSelectedInvoice(prevState => ({
        ...prevState,
        [name]: name === 'InvoiceDate' ? new Date(value).toISOString().split('T')[0] : value
      }));
    };
    
    const handleDelete = (InvoiceNumber) => {
      fetch(`http://localhost:5000/api/data/${InvoiceNumber}`, {
        method: 'DELETE'
      })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        fetch('http://localhost:5000/api/data')
          .then(response => response.json())
          .then(data => setInvoices(data))
          .catch(error => console.error('Error fetching data:', error));
      })
      .catch(error => console.error('Error deleting invoice:', error));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      fetch(`http://localhost:5000/api/data/${selectedInvoice.InvoiceNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedInvoice)
      })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        fetch('http://localhost:5000/api/data')
          .then(response => response.json())
          .then(data => setInvoices(data))
          .catch(error => console.error('Error fetching data:', error));
        setSelectedInvoice(null);
      })
      .catch(error => console.error('Error updating invoice:', error));
    };
  
    // Function to handle filtering
    const handleFilter = (companyName) => {
      setFilterCompany(companyName); // Update the filterCompany state
      fetch(`http://localhost:5000/api/data/filter?companyName=${companyName}`)
        .then(response => response.json())
        .then(data => setInvoices(data))
        .catch(error => console.error('Error filtering data:', error));
    };
  
    // Apply filtering when filterCompany changes
    useEffect(() => {
      if (filterCompany) {
        handleFilter(filterCompany);
      }
    }, [filterCompany]);
  

    


    const previewInvoice = async (destinationFolder, uniqueId) => {
      try {
        // Construct the URL for fetching the PDF file from the backend
        const url = `http://localhost:5000/api/invoices/${encodeURIComponent(destinationFolder)}/${encodeURIComponent(uniqueId)}/preview`;
   
        // Open the file in a new tab
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error previewing invoice:', error);
        // Handle the error, e.g., display an error message to the user
        alert('Error previewing invoice. Please try again later.');
      }
    }; 







  return (
<div className="table-container">
<div className="table-wrapper">
<table>
<thead>
<tr>
<th className="fixed-column">Sr No</th>
<th>Preview</th>
<th>Unique Id</th>
<th>E-mail Id</th>
<th>File Name</th>
<th colSpan="2">Action</th>






              
</tr>
</thead>
<tbody>

{invoices.map((invoice,index) => (

<tr key={index}>
<td className="fixed-column">{index + 1}</td>
<td><button className="btn btn-warning" onClick={() => previewInvoice(invoice.DestinationFolder,invoice.UniqueId)}>Preview</button></td>
<td>{invoice.UniqueId}</td>
<td>{invoice.MailId}</td>
<td>{invoice.FileName}</td>
{/* <td>{invoice.DestinationFolder}</td>  */}
<td className="invoice-action">
  {selectedInvoice && selectedInvoice.UniqueId === invoice.UniqueId ? (
    <div className="action-button">
    <button className="btn btn-primary m-1" onClick={handleSubmit}>Update</button>
    <button className="btn btn-secondary m-1" onClick={() => handleUpdate(invoice.InvoiceNumber)}>Cancel</button>
    </div>
                    ) : (
    <div className="">
    <button className="btn btn-outline-dark" onClick={() => handleUpdate(invoice.InvoiceNumber)}>Edit</button>
                           
    </div>
                    )}
    </td>
    <td>
    <button className="btn btn-outline-danger" onClick={() => handleDelete(invoice.InvoiceNumber)}>Delete</button>
    </td>
</tr>

 ))}



</tbody>
</table>
</div>
</div>
  );
};
 
export default InvoiceList;