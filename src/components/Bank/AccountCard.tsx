import { Card, CardContent, Typography } from '@mui/material';

interface AccountCardProps {
  account: {
    id: string;
    balance: number;
    currency: string;
  };
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {account.currency} Account
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {account.id}
        </Typography>
        <Typography variant="body2">
          Balance: {account.balance.toFixed(2)} {account.currency}
        </Typography>
      </CardContent>
    </Card>
  );
}