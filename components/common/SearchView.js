import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import {
  Container, Row, Col, Input, Label, FormGroup,
} from 'reactstrap';
import { Link } from 'routes';
import { useTranslation } from 'common/i18n';
import TextInput from 'components/common/TextInput';
import Button from 'components/common/Button';
import PlanTag from 'components/plans/PlanTag';
import { usePlan } from 'context/plan';
import ContentLoader from './ContentLoader';

const SEARCH_QUERY = gql`
query SearchQuery($plan: ID!, $query: String!, $onlyOtherPlans: Boolean) {
  search(plan: $plan, query: $query, includeRelatedPlans: true, onlyOtherPlans: $onlyOtherPlans) {
    hits {
      title
      url
      plan {
        identifier
        image {
          rendition(size: "128x128") {
            src
          }
        }
        name
        shortName
        organization {
          name
        }
      }
      object {
        __typename
        ... on Action {
          identifier
          primaryOrg {
            name
          }
        }
        ... on Indicator {
          id
        }
      }
      page {
        title
        ... on CategoryPage {
          category {
            level {
              name
            }
          }
        }
      }
    }
  }
}
`;

const SearchSection = styled.div`
  padding-bottom: ${(props) => props.theme.spaces.s050};
  background-color: ${(props) => props.theme.neutralLight};
`;

const SearchHeader = styled.div`
  padding-top: ${(props) => props.theme.spaces.s300};
  margin-bottom: ${(props) => props.theme.spaces.s100};
  background-color: ${(props) => props.theme.neutralLight};

  h1 {
    font-size: ${(props) => props.theme.fontSizeXl};
    margin-bottom: ${(props) => props.theme.spaces.s150};

    @media (min-width: ${(props) => props.theme.breakpointMd}) {
      font-size: ${(props) => props.theme.fontSizeXxl};
    }
  }

  h2 {
    font-size: ${(props) => props.theme.fontSizeLg};
    margin-bottom: ${(props) => props.theme.spaces.s200};
  }
`;

const ResultsHeader = styled.div`
  margin: ${(props) => props.theme.spaces.s300} 0 ${(props) => props.theme.spaces.s300} 0;
`;

const HitType = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.s050};
  font-size: ${(props) => props.theme.fontSizeSm};
`;

const HitPrimaryOrg = styled.div`
  margin-bottom: ${(props) => props.theme.spaces.s050};
  color: ${(props) => props.theme.graphColors.grey050};
`;

const SearchResultList = styled.ul`
  list-style: none;
  margin: 0 0 ${(props) => props.theme.spaces.s600} 0;
  padding: 0;
`;

const StyledSearchResultItem = styled.li`
  margin: 0 0 ${(props) => props.theme.spaces.s150} 0;
  padding: ${(props) => props.theme.spaces.s050} 0;
  border-top: 1px solid ${(props) => props.theme.themeColors.light};

  h3 {
    margin: 0;
    font-size: ${(props) => props.theme.fontSizeBase};
  }

  a:hover {
    text-decoration: underline;
  }
`;

const ResultExcerpt = styled.div`

`;

function SearchResultItem({ hit }) {
  const { t } = useTranslation();
  const plan = usePlan();
  const { object, page } = hit;
  const primaryOrg = object?.primaryOrg;
  let hitTypeName;

  if (object) {
    const typename = object.__typename;
    if (typename === 'Action') {
      hitTypeName = t('action');
    } else if (typename === 'Indicator') {
      hitTypeName = t('indicator');
    }
  } else if (page) {
    if (page.category) {
      hitTypeName = page.category.level?.name;
    }
    if (!hitTypeName) hitTypeName = t('page');
  }
  return (
    <StyledSearchResultItem>
      {(plan.identifier !== hit.plan.identifier) && (
      <PlanTag
        planImage={hit.plan.image.rendition.src}
        planShortName={hit.plan.shortName || hit.plan.name}
        organization={hit.plan.organization.name}
      />
      )}
      {hitTypeName && (<HitType>{hitTypeName}</HitType>)}
      <Link href={hit.url} passHref>
        <a href>
          <h3>{hit.title}</h3>
        </a>
      </Link>
      <ResultExcerpt dangerouslySetInnerHTML={{ __html: hit.highlight }} />
      {primaryOrg && (<HitPrimaryOrg>{primaryOrg.name}</HitPrimaryOrg>)}
    </StyledSearchResultItem>
  );
}

const searchProps = PropTypes.shape({
  q: PropTypes.string,
  onlyOtherPlans: PropTypes.bool,
});

function SearchResults({ search }) {
  const plan = usePlan();
  const { t } = useTranslation('common');
  const { error, loading, data } = useQuery(SEARCH_QUERY, {
    variables: {
      plan: plan.identifier,
      query: search.q,
      onlyOtherPlans: search.onlyOtherPlans,
    },
  });
  if (error) {
    return <div>{error.toString()}</div>;
  }
  if (loading) {
    return <ContentLoader />;
  }
  const { hits } = data.search;

  return (
    <Row>
      <Col sm="12" md={{ offset: 3, size: 6 }}>
        <ResultsHeader>
          {`${t('number-of-search-results', { count: hits.length })} `}
          &apos;
          {search.q}
          &apos;
        </ResultsHeader>
        <SearchResultList>
          { hits.map((hit) => (
            <SearchResultItem key={hit.url} hit={hit} />
          ))}
        </SearchResultList>
      </Col>
    </Row>
  );
}
SearchResults.propTypes = {
  search: searchProps.isRequired,
};

function SearchView(props) {
  const {
    search,
    onSearchChange,
  } = props;
  const [userSearch, setUserSearch] = useState(search);
  const { t } = useTranslation('common');

  const handleValueChange = (event) => {
    const { target } = event;
    const { name } = target;
    let value;
    if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }
    setUserSearch({
      ...userSearch,
      [name]: value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchChange(userSearch);
  };

  return (
    <>
      <SearchSection id="search-results">
        <SearchHeader>
          <Container>
            <Row>
              <Col sm="12" md={{ offset: 3, size: 6 }}>
                <h1>{t('search')}</h1>
                <form>
                  <TextInput
                    type="search"
                    id="q"
                    name="q"
                    placeholder={t('search-from-plans')}
                    value={userSearch.q}
                    onChange={handleValueChange}
                  />
                  <FormGroup switch>
                    <Input
                      type="switch"
                      id="other-plans-only"
                      name="onlyOtherPlans"
                      checked={userSearch.onlyOtherPlans}
                      onChange={handleValueChange}
                    />
                    <Label for="other-plans-only">{t('other-plans-only')}</Label>
                  </FormGroup>
                  <Button
                    type="submit"
                    color="primary"
                    className="mb-3"
                    onClick={handleSubmit}
                    block
                  >
                    { t('search') }
                  </Button>
                </form>
              </Col>
            </Row>
          </Container>
        </SearchHeader>
      </SearchSection>
      <Container>
        { search.q ? (
          <SearchResults search={search} />
        ) : (
          <div>No query</div>
        )}
      </Container>
    </>
  );
}
SearchView.getSearchFromQuery = (query) => {
  const {
    q, onlyOtherPlans, ...rest
  } = query;
  return {
    q,
    onlyOtherPlans: onlyOtherPlans === 'true',
    ...rest,
  };
};

SearchView.propTypes = {
  search: searchProps.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default SearchView;