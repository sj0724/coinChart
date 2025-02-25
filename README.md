# Coin Chart
![스크린샷 2025-02-25 오전 10 31 17](https://github.com/user-attachments/assets/b8d4fe0a-f91c-4ab0-9a69-d334c976a430)
- 소개 : Binance API과 Lightweight Charts를 활용한 가상 화폐 차트
- URL : <a href='https://coin-chart-mauve.vercel.app/en/trade/BTCUSDT'>https://coin-chart-mauve.vercel.app/en/trade/BTCUSDT</a>

## 목표
1. 현재 거래중인 자산 확인 - 검색 및 정렬 기능
2. 가상 화폐 가격 확인 및 변동률 확인
3. 가상 화폐 거래 차트 확인 - 가격, 거래량
4. 실시간 거래 현황 확인
5. 실시간 매도, 매수 주문 확인
6. 매도, 매수 주문 클릭시 주문량 및 금액 확인

## 개발 기간
  전체 개발 기간 : 2025-02-20 ~ <br>

## 기술 스택
- **Languages**: HTML • CSS • JavaScript • TypeScript
- **Frameworks & Libraries**: Next.js 15(App router), Lightweight Charts, pnpm
- **State Management**: Tanstack-Query • Zustand
- **Styling**: Tailwind
- **Tool** : Git • GitHub

## 기술 선정 이유

- Next.js 15 App router : 최근 출시된 React 19와 Next 15버전을 사용해보고 익숙하게 하기 위함
- Lightweight Charts : Next.js에서 제공하는 템플릿에서 해당 라이브러리를 사용해 차트를 보여주는 템플릿이 있음 -> 최신 버전에서도 호환성에 문제가 없다고 판단, 실제 금융 데이터를 다루는 Trading View에서 개발되어서 금융 차트를 구현하기에 적합
- Tanstask-Query : Lightweight Charts는 클라이언트에서 차트를 생성하는 방식을 사용하는데 클라이언트 캐싱을 위해 사용
- Zustand : 다른 전역 상태 라이브러리(redux, recoil)에 비해 초기 세팅이 간편하고, 사용 방법이 간단해 간단한 서비스에서 전역 상태 관리를 하기에 최적이라고 판단

## 기능 설명 및 구현 이슈

### 가상 화폐 리스트 및 검색
- Web socket을 통해 실시간으로 가상 화폐 자산을 조회하고, 검색할 수 있습니다.
- 가상 화폐 클릭시 해당 가상 화폐 페이지로 이동합니다.

### 가상 화폐 차트
- 가상 화폐를 지정한 간격(3m ~ 1w)으로 설정해 변동률을 확인할 수 있습니다.
- 가상 화폐의 가격 변동은 candle chart / 거래량은 line chart로 확인할 수 있습니다.
- 마우스 호버시, 날짜에 해당하는 정보를 확인할 수 있습니다.
- 차트 좌우로 이동시 과거 날짜에 해당하는 차트를 새로 불러옵니다.

### 주문 리스트
- Web socket을 통해 실시간으로 매도, 매수 주문 리스트를 확인할 수 있습니다.
- 주문 가격, 주문량, 총단가를 확인하고, 주문량에 따라 시각적으로 확인 가능합니다.
- 매도 주문를 클릭하면 해당 주문 상위 주문의 Amount, 매수 주문을 클릭하면 해당 주문 하위 주문의 Amount를 일괄 구매가능합니다.

### 실시간 거래 데이터
- Web socket을 통해 체결된 주문을 확인할 수 있습니다.

### 가상 화폐 정보
- Web socket을 통해 가상 화폐의 실시간 정보를 확인할 수 있습니다.
- 최근 거래된 데이터를 기반으로 거래 현황을 동시에 확인할 수 있습니다.

### 주문 기능
- 주문 리스트에서 클릭한 데이터를 기반으로 매도, 매수 금액과 거래량을 확인할 수 있습니다.

### 포스트 좋아요, 공유

### 알림
- 댓글, 좋아요, 팔로우 시 해당 유저에게 알림을 생성합니다.
- supabase의 subscribe 기능을 활용해 알림 채널을 생성해 사용하고 있습니다. 알림 테이블에 해당 유저 데이터가 추가되면 실시간으로 nav에 새로운 알림을 확인할 수 있습니다.
- 알림을 읽음과 읽지 않음 상태로 지정할 수 있습니다. 모든 알림을 읽으면 새로운 알림 표시가 사라집니다.
- 알림에 접속 링크 경로를 포함하여 알림 클릭시 게시물, 유저 페이지로 이동합니다.

## 코드 실행 가이드

1. `nvm use`를 사용해 node 버전을 20이상으로 설정해주세요.
2. `pnpm i`를 사용해 패키지를 설치해주세요.
3. `pnpm run build`를 사용해 실행해주시면 됩니다.
