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
import { formatCurrency } from "../../utils/formatters";

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
    shippingFee,
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
            marginBottom: 10
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
            fontSize: 9,
            color: "#555",
            lineHeight: 1.4
        },

            tableContainer: {
                marginVertical: 10,
                borderWidth: 1,
                
                borderColor: "#ccc",
                borderRadius: 6,
                overflow: "hidden",
                backgroundColor: "#fff",
            },
        tableHeaderName: {
            padding:5,
            fontSize: 10,
            fontWeight: "bold",
            color: "#444",
            marginBottom: 5,

        },
            tableHeader: {
                flexDirection: "row",
                backgroundColor: "#2c3e50",
            },
            headerCell: {
                flex: 1,
                fontSize: 10,
                fontWeight: "600",
                color: "#fff",
                textAlign: "center", // All headers centered by default
                paddingVertical: 5,
                borderRightWidth: 0.5,
                borderRightColor: "#fff", // Optional: subtle separation
            },
            tableRow: {
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 0.5,
                borderBottomColor: "#444",
                paddingVertical: 5,
            },
            tableCell: {
                flex: 1,
                fontSize: 10,
                color: "#222",
                paddingHorizontal: 5,
            },
            // Column-specific widths and alignment
            colSno: { flex: 0.5, textAlign: "center" },
            colItemId: { flex: 1, textAlign: "left" },
            colName: { flex: 2, textAlign: "left" ,fontSize:8 ,fontWeight:'semibold'},
            colQty: { flex: 1, textAlign: "center" },
            weight: { flex: 1, textAlign: "right" },
            colGross: { flex: 1, textAlign: "right" },
            colTax: { flex: 1, textAlign: "center" },
        colTaxType: { flex: 1, textAlign: "center", fontSize: 6, fontWeight: 'semibold' },
            colTaxAmount: { flex: 1, textAlign: "right" },
            colTotal: { flex: 2, textAlign: "right" },
            collapsibleContent: {
                backgroundColor: "#f9f9f9",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: "#ccc",
            },
        shippingContainer: {
            marginTop: 2,
            paddingHorizontal: 5,
        },

        shippingRow: {
            flexDirection: "row",
            justifyContent: "space-between",
        },

        shippingLabel: {
            fontSize: 10,
            fontWeight: "semibold",
        },

        shippingAmount: {
            fontSize: 10,
            fontFamily: "NotoSans",
        },
        amountInWordsSection: {
            marginTop: 5,
            padding: 6,
            backgroundColor: "#f8f9fa",
            borderLeft: "3 solid #f16137"
        },
        amountLabel: {
            fontSize: 10,
            fontWeight: "bold",
            color: "#444",
            marginBottom: 3
        },
        amountWords: {
            fontSize: 9,
            color: "#222",
            fontStyle: "italic"
        },
        totalSection: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            padding: 5,
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
            fontSize: 7,
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
        { key: "qty", label: "Qty", style: styles.colQty },
        { key: "weight", label: "Net Weight", style: styles.weight },
        { key: "grsAmt", label: "Gross Amt", style: styles.colGross },
        { key: "taxType", label: "Tax Type", style: styles.colTaxType },
        { key: "tax", label: "Tax %", style: styles.colTax },
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
                            <Text style={[styles.originName, { marginBottom: 2 }]}>{originAddress.name}</Text>
                            {originAddress.lines.map((line, i) => (
                                <Text key={i} style={styles.addressLine}>{(line || "").toUpperCase()}</Text>
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
                                <Text style={[styles.originName, { marginBottom: 2}]}>{customerName}</Text>
                            {customerAddress.map((line, i) => (
                                
                                        <Text key={i} style={styles.addressLine}>
                                            {(line || "").toUpperCase()}
                                        </Text>

                            ))}
                        </View>
                    </View>
                </View>

                {/* Items Table */}
                    <View style={styles.tableContainer}>
                        {/* Table Header */}
                        <View>
                            <Text style={styles.tableHeaderName}>ORDER ITEMS </Text>
                        </View>
                        <View style={styles.tableHeader}>
                            {tableHeaders.map((col, i) => (
                                <Text key={i} style={[styles.headerCell, col.style, { textAlign: "center" }, { fontSize: 10}]}>
                                    {col.label}
                                </Text>
                            ))}
                        </View>

                        {/* Table Rows */}
                        {items.map((item, i) => (
                            <View key={i}>
                                <View
                                    style={styles.tableRow}
                                >
                                    <Text style={[styles.tableCell, styles.colSno]}>{i + 1}</Text>
                                    <Text style={[styles.tableCell, styles.colItemId]}>{item.itemId || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colName]}>{item.name || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colQty]}>{Number(item.qty) || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.weight]}>{Number(item.netWt)?.toFixed(3) || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colGross]}>{Number(item.grsAmt)?.toFixed(2) || "0.00"}</Text>
                                    <Text style={[styles.tableCell, styles.colTaxType]}>{item.taxType || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colTax]}>{item.tax || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colTaxAmount]}>{Number(item.taxAmount)?.toFixed(2) || "0.00"}</Text>
                                    <Text style={[styles.tableCell, styles.colTotal]}>{Number(item.totalAmount)?.toFixed(2) || "0.00"}</Text>
                                </View>
                             
                            </View>
                        ))}
                    </View>
                    {shippingFee > 0 && (
                        <View style={styles.shippingContainer}>
                            <View style={styles.shippingRow}>
                                <Text style={styles.shippingLabel}>Shipping Fee</Text>
                                <Text style={styles.shippingAmount}>
                                    {Number(shippingFee).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Total Amount */}
                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>GRAND TOTAL</Text>
                        <Text style={styles.totalAmount}> ₹ {Number(totalAmount).toFixed(2)}</Text>
                    </View>

                {/* Amount in Words */}
                <View style={styles.amountInWordsSection}>
                    <Text style={styles.amountLabel}>Amount in Words:</Text>
                    <Text style={styles.amountWords}>{amountInWords}</Text>
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