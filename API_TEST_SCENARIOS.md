# API 테스트 시나리오

다양한 API 응답 상황을 테스트할 수 있는 Mock 데이터 시나리오입니다.

## 시나리오 1: 이자존 (기본)

```json
{
  "name": "이동준",
  "phone": "01012341234",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 80000000,
    "investBalance": 0,
    "todayProfit": "+0.00",
    "todayInterestAmount": 0,
    "todayZoneType": "INTEREST",
    "tommorrowZoneType": "INTEREST",
    "selectedRegionCode": "35510",
    "todayPowerWorkType": "NONE",
    "tomorrowPowerWorkType": "NONE",
    "selectedRegionName": "전북 전주시 덕진구"
  }
}
```

**UI 표시:**
- 계좌번호: 106-801-159626
- 총 자산: 80,000,000원
- 오늘 수익: +0.00%
- 투자 중: 0원
- 오늘 투자중인 존: 이자존
- 내일 투자할 존: 이자존

---

## 시나리오 2: 이자워크존

```json
{
  "name": "김철수",
  "phone": "01087654321",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 75000000,
    "investBalance": 5200000,
    "todayProfit": "+12.30",
    "todayInterestAmount": 1234,
    "todayZoneType": "INTEREST_WORK",
    "tommorrowZoneType": "INTEREST_WORK",
    "selectedRegionCode": "11110",
    "todayPowerWorkType": "NONE",
    "tomorrowPowerWorkType": "NONE",
    "selectedRegionName": "서울특별시 종로구"
  }
}
```

**UI 표시:**
- 총 자산: 80,200,000원 (75,000,000 + 5,200,000)
- 오늘 수익: +12.30%
- 투자 중: 5,200,000원
- 오늘 투자중인 존: 이자워크존
- 내일 투자할 존: 이자워크존

---

## 시나리오 3: 파워워크존 25% (안정형)

```json
{
  "name": "박영희",
  "phone": "01055556666",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 60000000,
    "investBalance": 15000000,
    "todayProfit": "+18.75",
    "todayInterestAmount": 2345,
    "todayZoneType": "POWER_WORK",
    "tommorrowZoneType": "POWER_WORK",
    "selectedRegionCode": "26110",
    "todayPowerWorkType": "SAFE",
    "tomorrowPowerWorkType": "SAFE",
    "selectedRegionName": "부산광역시 중구"
  }
}
```

**UI 표시:**
- 총 자산: 75,000,000원
- 오늘 수익: +18.75%
- 투자 중: 15,000,000원
- 오늘 투자중인 존: **파워워크존 25%**
- 내일 투자할 존: **파워워크존 25%**

---

## 시나리오 4: 파워워크존 50% (균형형)

```json
{
  "name": "최민수",
  "phone": "01099998888",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 50000000,
    "investBalance": 25000000,
    "todayProfit": "+25.50",
    "todayInterestAmount": 3456,
    "todayZoneType": "POWER_WORK",
    "tommorrowZoneType": "POWER_WORK",
    "selectedRegionCode": "27110",
    "todayPowerWorkType": "BALANCED",
    "tomorrowPowerWorkType": "BALANCED",
    "selectedRegionName": "대구광역시 중구"
  }
}
```

**UI 표시:**
- 총 자산: 75,000,000원
- 오늘 수익: +25.50%
- 투자 중: 25,000,000원
- 오늘 투자중인 존: **파워워크존 50%**
- 내일 투자할 존: **파워워크존 50%**

---

## 시나리오 5: 파워워크존 75% (공격형)

```json
{
  "name": "정수진",
  "phone": "01044443333",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 40000000,
    "investBalance": 30000000,
    "todayProfit": "+35.80",
    "todayInterestAmount": 4567,
    "todayZoneType": "POWER_WORK",
    "tommorrowZoneType": "POWER_WORK",
    "selectedRegionCode": "28110",
    "todayPowerWorkType": "ATTACK",
    "tomorrowPowerWorkType": "ATTACK",
    "selectedRegionName": "인천광역시 중구"
  }
}
```

**UI 표시:**
- 총 자산: 70,000,000원
- 오늘 수익: +35.80%
- 투자 중: 30,000,000원
- 오늘 투자중인 존: **파워워크존 75%**
- 내일 투자할 존: **파워워크존 75%**

---

## 시나리오 6: 존 전환 (이자존 → 파워워크존 50%)

```json
{
  "name": "강지훈",
  "phone": "01022221111",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 80000000,
    "investBalance": 0,
    "todayProfit": "+0.00",
    "todayInterestAmount": 0,
    "todayZoneType": "INTEREST",
    "tommorrowZoneType": "POWER_WORK",
    "selectedRegionCode": "41110",
    "todayPowerWorkType": "NONE",
    "tomorrowPowerWorkType": "BALANCED",
    "selectedRegionName": "경기도 수원시"
  }
}
```

**UI 표시:**
- 오늘 투자중인 존: 이자존
- 내일 투자할 존: **파워워크존 50%**
- 카운트다운: 내일 00:00에 자동 전환

---

## 시나리오 7: 첫 로그인 (투자 이력 없음)

```json
{
  "name": "신입회원",
  "phone": "01011112222",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 100000000,
    "investBalance": 0,
    "todayProfit": "+0.00",
    "todayInterestAmount": 0,
    "todayZoneType": "NONE",
    "tommorrowZoneType": "INTEREST",
    "selectedRegionCode": "35510",
    "todayPowerWorkType": "NONE",
    "tomorrowPowerWorkType": "NONE",
    "selectedRegionName": "전북 전주시 덕진구"
  }
}
```

**UI 표시:**
- 오늘 투자중인 존: 이자존 (NONE → 기본값)
- 내일 투자할 존: 이자존
- 투자 이력 없음

---

## 시나리오 8: 손실 발생 (마이너스 수익)

```json
{
  "name": "손실회원",
  "phone": "01033334444",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 70000000,
    "investBalance": -5000000,
    "todayProfit": "-8.20",
    "todayInterestAmount": 0,
    "todayZoneType": "POWER_WORK",
    "tommorrowZoneType": "INTEREST",
    "selectedRegionCode": "41110",
    "todayPowerWorkType": "ATTACK",
    "tomorrowPowerWorkType": "NONE",
    "selectedRegionName": "경기도 수원시"
  }
}
```

**UI 표시:**
- 총 자산: 65,000,000원
- 오늘 수익: **-8.20%** (빨간색)
- 투자 중: -5,000,000원 (손실)
- 오늘 투자중인 존: 파워워크존 75%
- 내일 투자할 존: 이자존 (안전하게 전환)

---

## 개발자 도구로 시나리오 테스트하기

1. 앱 실행
2. 우측 하단 ⚙️ 버튼 클릭
3. "Mock 모드로 전환" (이미 Mock이면 그대로)
4. `/src/lib/api/rest-api.ts` 파일 수정
5. `getUserInfo()` 함수의 Mock 데이터 교체
6. 새로고침

## PowerWorkType 매핑 정리

| API 값 | 앱 내부 값 | UI 표시 | 설명 |
|--------|-----------|---------|------|
| NONE | undefined | (표시 안함) | 파워워크존 미선택 |
| SAFE | 25 | 25% | 안정형 - 원금 25% 투자 |
| BALANCED | 50 | 50% | 균형형 - 원금 50% 투자 |
| ATTACK | 75 | 75% | 공격형 - 원금 75% 투자 |

## ZoneType 매핑 정리

| API 값 | 앱 내부 값 | UI 표시 |
|--------|-----------|---------|
| NONE | interest | 이자존 |
| INTEREST | interest | 이자존 |
| INTEREST_WORK | extreme | 이자워크존 |
| POWER_WORK | balance | 파워워크존 (+ 비율%) |

---

**테스트 완료!** 🎉
