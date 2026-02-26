import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font
} from "@react-pdf/renderer";
import invoiceImg from './invoice.jpeg';
import logo from '../../assets/icons/fallback.jpg'

export default function InvoiceDocument({
    orderId,
    orderDate,
    originAddress,
    customerName,
    customerMobile,
    customerAddress,
    paymentMode,
    paymentStatus,
    transactionId,
    items,
    totalAmount,
    amountInWords,

    companyName
}) {
    Font.register({
        family: "NotoSans",
        fonts: [
            { src: "/font/noto/NotoSans-Regular.ttf" },
            { src: "/font/noto/NotoSans-Bold.ttf", fontWeight: "bold" }
        ]
    });

    const styles = StyleSheet.create({
        page: {
            fontSize: 10,
            color: "#333",
            fontFamily: "Helvetica",
            position: "relative"
        },
        backgroundImage: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        },
        pageBody:{
            padding: 30,
        },
        accentBar: {
            height: 4,
            backgroundColor: "#f16137",
            marginBottom: 20
        },
        headerSection: {
            display:'flex',
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems:'center',
            marginBottom: 10
        },
        companyLogo: {
            width: 120,
        },
        documentTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#f16137",
        },
        documentSubtitle: {
            fontSize: 10,
            color: "#666",
            letterSpacing: 1
        },
        detailsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20
        },
        column: {
            width: "48%"
        },
        sectionTitle: {
            fontSize: 10,
            fontWeight: "bold",
            color: "#f16137",
            marginBottom: 8,
            borderBottom: "1 solid #eee",
            paddingBottom: 3
        },
        detailRow: {
            flexDirection: "row",
            marginBottom: 5
        },
        detailLabel: {
            fontWeight: "bold",
            minWidth: 90,
            color: "#444"
        },
        originName:{
            fontWeight: "bold",
            color: "#444"
        },
        detailValue: {
            flex: 1,
            color: "#555"
        },
        addressContainer: {
            padding: 5,
            borderRadius: 3
        },
        addressLine: {
            fontSize: 10,
            color: "#555",
            lineHeight: 1.4
        },
        tableContainer: {
            marginTop: 5,
            marginBottom: 15
        },
        tableHeader: {
            flexDirection: "row",
            backgroundColor: "#2c3e50",
            paddingVertical: 8,
            paddingHorizontal: 5,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4
        },
        headerCell: {
            fontSize: 9,
            fontWeight: "bold",
            color: "#FFFFFF",
            textAlign: "center"
        },
        tableRow: {
            flexDirection: "row",
            paddingVertical: 7,
            paddingHorizontal: 5,
            borderBottom: "0.5 solid #eaeaea"
        },
        tableCell: {
            fontSize: 9,
            color: "#444",
            textAlign: "center"
        },
        colSno: { width: "5%" },
        colItemId: { width: "10%" },
        colName: { width: "20%" },
        colDesc: { width: "15%" },
        colQty: { width: "8%" },
        colGross: { width: "10%" },
        colTax: { width: "8%" },
        colTaxType: { width: "8%" },
        colTaxAmount: { width: "8%" },
        colTotal: { width: "8%" },
        amountInWordsSection: {
            marginTop: 15,
            padding: 12,
            backgroundColor: "#f8f9fa",
            borderLeft: "3 solid #f16137"
        },
        amountLabel: {
            fontSize: 9,
            fontWeight: "bold",
            color: "#444",
            marginBottom: 3
        },
        amountWords: {
            fontSize: 12,
            color: "#222",
            fontStyle: "italic"
        },
        totalSection: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            padding: 10,
            backgroundColor: "#f16137",
            borderRadius: 4
        },
        totalLabel: {
            fontSize: 11,
            fontWeight: "bold",
            color: "#FFFFFF"
        },
        totalAmount: {
            fontSize: 12,
            fontFamily:"NotoSans",
            fontWeight: "bold",
            color: "#FFFFFF"
        },
        footer: {
            position: "absolute",
            bottom: 25,
            left: 30,
            right: 30,
            textAlign: "center",
            fontSize: 8,
            color: "#777",
            borderTop: "0.5 solid #ddd",
            paddingTop: 12
        },
        footerNote: {
            fontStyle: "italic",
            marginBottom: 4
        },
        pageInfo: {
            fontSize: 8,
            color: "#999"
        }
    });

    const tableHeaders = [
        { key: "sno", label: "S.No", style: styles.colSno },
        { key: "itemId", label: "Item ID", style: styles.colItemId },
        { key: "name", label: "Product Name", style: styles.colName },
        { key: "desc", label: "Description", style: styles.colDesc },
        { key: "qty", label: "Qty", style: styles.colQty },
        { key: "grsAmt", label: "Gross Amt", style: styles.colGross },
        { key: "tax", label: "Tax %", style: styles.colTax },
        { key: "taxType", label: "Tax Type", style: styles.colTaxType },
        { key: "taxAmount", label: "Tax Amt", style: styles.colTaxAmount },
        { key: "total", label: "Total", style: styles.colTotal },
    ];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Subtle Background */}
                <Image src={invoiceImg} style={styles.backgroundImage} fixed />
                <View style={styles.pageBody}>
                {/* Accent Bar */}
                {/* <View style={styles.accentBar} /> */}

                {/* Header */}
                <View style={styles.headerSection}>
                    <View>
                        <Text style={styles.documentTitle}>{companyName}</Text>
                        <Text style={styles.documentSubtitle}>TAX INVOICE</Text>
                    </View>
                        <Image src={logo} style={styles.companyLogo} />
                </View>

                {/* Order & Customer Details */}
                <View style={styles.detailsContainer}>
                    {/* Order Details Column */}
                    <View style={styles.column}>
                        <Text style={styles.sectionTitle}>ORDER DETAILS</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Order ID:</Text>
                            <Text style={styles.detailValue}>{orderId}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Order Date:</Text>
                            <Text style={styles.detailValue}>{orderDate}</Text>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>SHIPPED FROM</Text>
                        <View style={styles.addressContainer}>
                            <Text style={[styles.originName, { marginBottom: 4 }]}>{originAddress.name}</Text>
                            {originAddress.lines.map((line, i) => (
                                <Text key={i} style={styles.addressLine}>{line}</Text>
                            ))}
                        </View>
                    </View>

                    {/* Customer & Payment Column */}
                    <View style={styles.column}>
                        <Text style={styles.sectionTitle}>BILL TO</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Customer:</Text>
                            <Text style={styles.detailValue}>{customerName}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Contact:</Text>
                            <Text style={styles.detailValue}>{customerMobile}</Text>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>PAYMENT DETAILS</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Transaction ID :</Text>
                            <Text style={styles.detailValue}>{transactionId}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Mode Of Pay :</Text>
                            <Text style={styles.detailValue}>{paymentMode}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment Status :</Text>
                            <Text style={[styles.detailValue, {
                                color: paymentStatus?.toLowerCase() === 'paid' ? '#025e0a' : '#fa2209',
                                fontWeight: 'bold'
                            }]}>
                                {paymentStatus}
                            </Text>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>SHIPPING ADDRESS</Text>
                        <View style={styles.addressContainer}>
                            {customerAddress.map((line, i) => (
                                <Text key={i} style={styles.addressLine}>{line}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        {tableHeaders.map((col, i) => (
                            <Text key={i} style={[styles.headerCell, col.style]}>
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {items.map((item, i) => (
                        <View style={styles.tableRow} key={i}>
                            <Text style={[styles.tableCell, styles.colSno]}>{i + 1}</Text>
                            <Text style={[styles.tableCell, styles.colItemId]}>{item.itemId || "—"}</Text>
                            <Text style={[styles.tableCell, styles.colName]}>{item.name || "—"}</Text>
                            <Text style={[styles.tableCell, styles.colDesc]}>{item.desc || "—"}</Text>
                            <Text style={[styles.tableCell, styles.colQty]}>{item.qty || "—"}</Text>
                            <Text style={[styles.tableCell, styles.colGross]}>₹{item.grsAmt?.toFixed(2) || "0.00"}</Text>
                            <Text style={[styles.tableCell, styles.colTax]}>{item.tax || "—"}</Text>
                            <Text style={[styles.tableCell, styles.colTaxType]}>{item.taxType || "—"}</Text>
                            <Text style={[styles.tableCell, styles.colTaxAmount]}>₹{item.taxAmount?.toFixed(2) || "0.00"}</Text>
                            <Text style={[styles.tableCell, styles.colTotal]}>₹{item.totalAmount?.toFixed(2) || "0.00"}</Text>
                        </View>
                    ))}
                </View>

                {/* Amount in Words */}
                <View style={styles.amountInWordsSection}>
                    <Text style={styles.amountLabel}>Amount in Words:</Text>
                    <Text style={styles.amountWords}>{amountInWords}</Text>
                </View>

                {/* Total Amount */}
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>GRAND TOTAL</Text>
                    <Text style={styles.totalAmount}> ₹ {totalAmount.toFixed(2)}</Text>
                </View>

                
            </View>
                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerNote}>
                        * This is a computer-generated invoice and does not require a physical signature *
                    </Text>
                    <Text style={styles.pageInfo}>
                        Invoice ID: {orderId} | Generated on: {new Date().toLocaleDateString()}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}