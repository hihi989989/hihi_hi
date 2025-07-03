const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');

// 获取未来的工作日
function getNextWorkday(baseDate, offsetDays = 1) {
  let date = dayjs(baseDate).add(offsetDays, 'day');
  while (date.day() === 0 || date.day() === 6) { // Sunday = 0, Saturday = 6
    date = date.add(1, 'day');
  }
  return date;
}

async function generateExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Inbound');

  const warehouses = ['WHCANON001-Toronto(WH02001)', 'WHCANAB001-Calgary(WH02002)', 'WHCANQC001-Montreal(WH02003)' , 'WHCANBC001-Vancouver(WH02004)', 'WHUSACA001-California(WS01001)', 'WHCANON002-Aurora(WS02001)'];
  const packageUnits = ['EA', 'CS', 'PL'];
  const skuList = ['987650', '987655', 'S987656-1', 'S987650', '987655'];
  const customerIds = ['987656-V0612', '987650-us', 'NS0175', '0-987650', '0-987650'];
  sheet.columns = [
    { header: 'Owner ID*', key: 'ownerId' },
    { header: 'PO#*', key: 'po' },
    { header: 'Inbound Warehouse*', key: 'warehouse' },
    { header: 'Expected Arrive Time*(yyyy-MM-dd)', key: 'arrival' },
    { header: 'Customer Id*', key: 'customerId' },
    { header: 'SKU*', key: 'sku' },
    { header: 'SKU Package Unit*', key: 'packageUnit' },
    { header: 'SKU Qty*', key: 'skuQty' },
    { header: 'Expiration Date(yyyy-MM-dd)', key: 'expiration' },
    { header: 'Batch No', key: 'batchNo' },
  ];

  const today = dayjs();

  for (let i = 1; i <= 5; i++) {
  const arrivalDate = getNextWorkday(today, i).format('YYYY-MM-DD');
  const expirationDate = dayjs(arrivalDate).add(1, 'year').format('YYYY-MM-DD');

  const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
  const packageUnit = packageUnits[Math.floor(Math.random() * packageUnits.length)];
  const sku = skuList[Math.floor(Math.random() * skuList.length)];
  const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];

  function generateRandom4Digits() {
  return Math.floor(1000 + Math.random() * 9000);
}

  sheet.addRow({
    ownerId: 'NS0048',
    po: `Autotest-inbound-upload-${generateRandom4Digits()}`,
    warehouse,
    arrival: arrivalDate,
    customerId,
    sku,
    packageUnit,
    skuQty: 100 * i,
    expiration: expirationDate,
    batchNo: `BATCH-${i}`
  });
}
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Excel 文件已生成：${filePath}`);
}

// 设置保存路径
const savePath = path.join(__dirname, '../downloads/inbound_test.xlsx');

// 创建 downloads 文件夹（如果还不存在）
if (!fs.existsSync(path.dirname(savePath))) {
  fs.mkdirSync(path.dirname(savePath));
}

// 执行
generateExcel(savePath);