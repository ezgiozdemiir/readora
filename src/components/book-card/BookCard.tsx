import { IconHeart } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import classes from './BookCard.module.css';
import type { Book } from '../../types/types';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';

type Props = {
  book: Book
}

export const BookCard: React.FC<Props> = ({ book }) => {
   const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(book.primary_isbn13));
  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={book.book_image} alt={book.title} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {book.title}
          </Text>
          <Badge size="sm" variant="light">
            {book.author}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {book.description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Buy Links:
        </Text>
       <Group gap={7} mt={5} wrap="wrap">
          {book.buy_links.map((link) => (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={link.name}
              style={{ textDecoration: 'none' }}
            >
              <Badge variant="light" style={{ cursor: 'pointer' }}>
                {link.name}
              </Badge>
            </a>
          ))}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button component={Link} to={`/books/${book.primary_isbn13}`} radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        <ActionIcon variant="default" radius="md" size={36}
          onClick={() => toggleWishlist(book)}
          color={isInWishlist ? 'blue' : undefined}>
          <IconHeart className={classes.like} stroke={1.5}  
            fill={isInWishlist ? '#228be6' : 'none'}/>
        </ActionIcon>
      </Group>
    </Card>
  );
}