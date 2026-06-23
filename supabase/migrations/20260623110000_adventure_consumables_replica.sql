-- Shadow Dark — corrige a entrega de eventos DELETE do Realtime.
-- Com REPLICA IDENTITY padrão (só a PK), o registro `old` do DELETE não tem
-- adventure_id, então o filtro `adventure_id=eq.X` da assinatura descarta o
-- evento. FULL faz o `old` carregar todas as colunas → o DELETE chega a todos
-- os membros da mesa (apagar/expirar somem ao vivo).
alter table public.adventure_consumables replica identity full;
