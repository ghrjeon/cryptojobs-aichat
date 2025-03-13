const customStyles = {
    table: {
        style: {
            tableLayout: 'fixed', 
            width: '200%', 
        },
    },
    title: {
        style: {
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#333',
        },
    },
    header: {
        style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#333',
            backgroundColor: '#f1f1f1',
        },
    },
    rows: {
        style: {
            minHeight: '50px', // Override the row height
        },
    },
    cells: {
        style: {
            fontSize: '12px',
            whiteSpace: 'normal', // Prevent cell content from wrapping
            textAlign: 'center', 
        },
    },
    headCells: {
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap', // Allow header text to wrap
            // textOverflow: 'ellipsis', // Handle long text gracefully
            // overflow: 'visible', // Ensure overflow is visible
        },
    },
    pagination: {
        style: {
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #ddd',
            margin: 'auto',
        },
    },
    context: {
        style: {
            background: '#000000',
            text: '#000000',
        },
    },
};

const functionColors = {
    'Engineering, Product, and Research': '#FFDAC1',  // Pastel Orange
    'Business, Strategy, and Operations': '#FFFFBA',  // Pastel Yellow
    'Data and Analytics': '#B5EAD7',     // Pastel Mint
    'Design, Art, and Creative': '#C7CEEA',      // Pastel Purple
};

export { customStyles, functionColors };